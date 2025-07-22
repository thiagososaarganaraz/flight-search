import axios, { AxiosError, AxiosResponse } from 'axios';
import type { FlightSearchParams, FlightSearchResponse, Flight, AirportSearchResult, AppConfig } from "@/types/flight"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://sky-scrapper.p.rapidapi.com/api/v1";
const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "";

interface AlternativeFlightSearchResult {
  date: string;
  results: FlightSearchResponse;
}

class FlightApiService {
  private axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
      'Content-Type': 'application/json'
    }
  });

  private cachedConfig: AppConfig | null = null;

  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data as { message?: Array<{ [key: string]: string }> | string };
        
        if (Array.isArray(errorData.message)) {
          const errorMessages = errorData.message.map(err => Object.values(err).join(' ')).join(', ');
          throw new Error(errorMessages);
        } else if (typeof errorData.message === 'string') {
          throw new Error(errorData.message);
        }
      }

      switch (axiosError.response?.status) {
        case 400:
          throw new Error("Invalid search parameters. Please check your input and try again.");
        case 401:
          throw new Error("API authentication failed. Please check your API key.");
        case 403:
          throw new Error("Access forbidden. You may have exceeded your API quota.");
        case 404:
          throw new Error("Flight search service not found.");
        case 429:
          throw new Error("Too many requests. Please wait a moment and try again.");
        case 500:
          throw new Error("Flight search service is temporarily unavailable.");
        default:
          throw new Error(`Flight search failed: ${axiosError.message}`);
      }
    } else if (error instanceof Error) {
      throw error;
    }
    
    throw new Error("An unexpected error occurred while searching for flights.");
  }

  private async getAppConfig(): Promise<AppConfig> {
    if (this.cachedConfig) {
      return this.cachedConfig;
    }

    try {
      const response = await this.axiosInstance.get<{ data: AppConfig }>('/getConfig');
      this.cachedConfig = response.data.data;
      return this.cachedConfig;
    } catch (error) {
      this.handleError(error);
    }
  }

  async searchAirports(query: string): Promise<AirportSearchResult[]> {
    try {
      if (!query || query.length < 2) {
        throw new Error("Please enter at least 2 characters to search for airports.");
      }

      const response = await this.axiosInstance.get<{ data: AirportSearchResult[] }>('/flights/searchAirport', {
        params: {
          query
        }
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  private async getAirportIds(airportQuery: string): Promise<{ skyId: string; entityId: string }> {
    try {
      // If already in format "skyId|entityId", just split and return
      if (airportQuery.includes('|')) {
        const [skyId, entityId] = airportQuery.split('|');
        return { skyId: skyId.trim(), entityId: entityId.trim() };
      }

      // Otherwise search for the airport
      const airports = await this.searchAirports(airportQuery);
      if (!airports || airports.length === 0) {
        throw new Error(`No airports found for query: ${airportQuery}`);
      }

      // Return the first matching airport
      return {
        skyId: airports[0].skyId,
        entityId: airports[0].entityId
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async searchFlights(params: FlightSearchParams): Promise<FlightSearchResponse> {
    try {
      // Validate input parameters
      if (!params.origin || !params.destination) {
        throw new Error("Origin and destination are required.");
      }

      if (!params.departureDate) {
        throw new Error("Departure date is required.");
      }

      if (params.adults < 1) {
        throw new Error("At least one adult passenger is required.");
      }

      // Get airport IDs
      const [originIds, destinationIds] = await Promise.all([
        this.getAirportIds(params.origin),
        this.getAirportIds(params.destination)
      ]);

      // Get app config for default values
      const config = await this.getAppConfig();

      // Prepare request parameters
      const requestParams: Record<string, any> = {
        originSkyId: originIds.skyId,
        destinationSkyId: destinationIds.skyId,
        originEntityId: originIds.entityId,
        destinationEntityId: destinationIds.entityId,
        date: params.departureDate,
        cabinClass: params.cabinClass || 'economy',
        adults: params.adults,
        children: params.children || 0,
        infants: params.infants || 0,
        sortBy: params.sortBy || 'best',
        currency: params.currency || config?.currency || 'USD',
        market: params.market || config?.market || 'en-US',
        countryCode: params.countryCode || config?.countryCode || 'US'
      };

      // Add return date if it's a round trip
      if (params.returnDate && params.tripType === 'round_trip') {
        requestParams.returnDate = params.returnDate;
      }

      const response = await this.axiosInstance.get<FlightSearchResponse>('/flights/searchFlights', {
        params: requestParams
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getFlightDetails(flightId: string): Promise<Flight> {
    try {
      const response = await this.axiosInstance.get<Flight>(`/flights/getFlightDetails/${flightId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export async function searchFlightsWithAlternatives(
  originalParams: FlightSearchParams,
  daysToCheck: number = 3
): Promise<{
  originalDate: string;
  foundResults: AlternativeFlightSearchResult[];
  message?: string;
}> {
  // First try the original date
  const originalResults = await flightApiService.searchFlights(originalParams);
  
  // If we have results, return them immediately
  if (originalResults.flights.length > 0) {
    return {
      originalDate: originalParams.departureDate,
      foundResults: [{
        date: originalParams.departureDate,
        results: originalResults
      }]
    };
  }

  // Generate alternative dates (-1, +1, -2, +2, -3, +3)
  const alternativeDates: string[] = [];
  const originalDate = new Date(originalParams.departureDate);
  
  for (let i = 1; i <= daysToCheck; i++) {
    // Previous days
    const prevDate = new Date(originalDate);
    prevDate.setDate(originalDate.getDate() - i);
    alternativeDates.push(prevDate.toISOString().split('T')[0]);
    
    // Next days
    const nextDate = new Date(originalDate);
    nextDate.setDate(originalDate.getDate() + i);
    alternativeDates.push(nextDate.toISOString().split('T')[0]);
  }

  // Search all alternative dates in parallel
  const searchPromises = alternativeDates.map(date => {
    const params = { ...originalParams, departureDate: date };
    return flightApiService.searchFlights(params)
      .then(results => ({ date, results }))
      .catch(() => ({ date, results: { flights: [], totalResults: 0, searchId: '' } }));
  });

  const allResults = await Promise.all(searchPromises);
  
  // Filter to only dates that have results
  const validResults = allResults.filter(result => 
    result.results.flights.length > 0
  );

  // Sort by closest to original date
  validResults.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const diffA = Math.abs(dateA.getTime() - originalDate.getTime());
    const diffB = Math.abs(dateB.getTime() - originalDate.getTime());
    return diffA - diffB;
  });

  // Prepare the response
  const response: {
    originalDate: string;
    foundResults: AlternativeFlightSearchResult[];
    message?: string;
  } = {
    originalDate: originalParams.departureDate,
    foundResults: validResults
  };

  // Add message if we had to use alternative dates
  if (validResults.length > 0 && validResults[0].date !== originalParams.departureDate) {
    response.message = `No flights found for ${originalParams.departureDate}, but here are some alternatives.`;
  }

  return response;
}

export const flightApiService = new FlightApiService();