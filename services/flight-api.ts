import axios, { AxiosError, AxiosResponse } from 'axios';
import type { FlightSearchParams, FlightSearchResponse, Flight, AirportSearchResult, AppConfig } from "@/types/flight"
import mockAirports from "@/data/mockAirports.json"; // Asegúrate de crear este archivo
import mockFlights from "@/data/mockFlights.json";   // Asegúrate de crear este archivo
import mockFlightDetails from "@/data/mockFlightDetails.json"; // Asegúrate de crear este archivo
import mockConfig from "@/data/mockConfig.json"; // Asegúrate de crear este archivo

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "";

interface AlternativeFlightSearchResult {
  date: string;
  results: FlightSearchResponse;
}

interface FormattedAirport {
  code: string;
  name: string;
  city: string;
  country: string;
  skyId: string;
  entityId: string;
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
      
      // Ya no lanzamos error en 429, se maneja en los métodos específicos
      if (axiosError.response?.status !== 429) {
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
            case 500:
              throw new Error("Flight search service is temporarily unavailable.");
            default:
              throw new Error(`Flight search failed: ${axiosError.message}`);
          }
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
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        console.warn("API limit reached (429). Using mock app config.");
        this.cachedConfig = mockConfig.data as AppConfig;
        return this.cachedConfig;
      }
      this.handleError(error);
    }
  }

  async searchAirports(query: string): Promise<FormattedAirport[]> {
      try {
        if (!query || query.length < 2) {
          throw new Error("Please enter at least 2 characters to search for airports.");
        }

        console.warn("Using mock airport data.");
                  
        const lowercaseQuery = query.toLowerCase();
        const mockData = mockAirports.data as AirportSearchResult[];
        
        const filteredMocks = mockData.filter(
            (airport) => 
                airport.skyId.toLowerCase().includes(lowercaseQuery) ||
                lowercaseQuery.includes(airport.skyId.toLowerCase()) ||
                airport.presentation?.title.toLowerCase().includes(lowercaseQuery) ||
                lowercaseQuery.includes(airport.presentation?.title.toLowerCase())
        );
        
        return filteredMocks.map((result: AirportSearchResult) => ({
            code: result.skyId,
            name: result.presentation?.title || result.navigation?.localizedName || 'Unknown',
            city: result.presentation?.title || '',
            country: result.presentation?.subtitle || '',
            skyId: result.skyId,
            entityId: result.entityId
          }));
      } catch (error) {
        this.handleError(error);
      }
    }

  private async getAirportIds(airportQuery: string): Promise<{ skyId: string; entityId: string }> {
    try {
      if (airportQuery.includes('|')) {
        const [skyId, entityId] = airportQuery.split('|');
        return { skyId: skyId.trim(), entityId: entityId.trim() };
      }

      const airports = await this.searchAirports(airportQuery);
      if (!airports || airports.length === 0) {
        throw new Error(`No airports found for query: ${airportQuery}`);
      }

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
      if (!params.origin || !params.destination) {
        throw new Error("Origin and destination are required.");
      }

      if (!params.departureDate) {
        throw new Error("Departure date is required.");
      }

      if (params.adults < 1) {
        throw new Error("At least one adult passenger is required.");
      }

      const [originIds, destinationIds] = await Promise.all([
        this.getAirportIds(params.origin),
        this.getAirportIds(params.destination)
      ]);

      const config = await this.getAppConfig();

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

      if (params.returnDate && params.tripType === 'round_trip') {
        requestParams.returnDate = params.returnDate;
      }

      const response = await this.axiosInstance.get<FlightSearchResponse>('/flights/searchFlights', {
        params: requestParams
      });

      return response.data;
    } catch (error) {
       if (axios.isAxiosError(error) && error.response?.status === 429) {
          console.warn("API limit reached (429). Using mock flight search data.");
          // Devuelve todo el mock, idealmente tu json mockeado debería tener la estructura exacta de FlightSearchResponse
          console.log("Mock flight search response:", mockFlights);
          return mockFlights as unknown as FlightSearchResponse; 
       }
      this.handleError(error);
    }
  }

  async getFlightDetails(flightId: string): Promise<Flight> {
    try {
      const response = await this.axiosInstance.get<Flight>(`/flights/getFlightDetails/${flightId}`);
      return response.data;
    } catch (error) {
       if (axios.isAxiosError(error) && error.response?.status === 429) {
          console.warn(`API limit reached (429). Using mock flight details for id: ${flightId}.`);
          return mockFlightDetails as unknown as Flight;
       }
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
  const originalResults = await flightApiService.searchFlights(originalParams);
  
  if (originalResults.flights.length > 0) {
    return {
      originalDate: originalParams.departureDate,
      foundResults: [{
        date: originalParams.departureDate,
        results: originalResults
      }]
    };
  }

  const alternativeDates: string[] = [];
  const originalDate = new Date(originalParams.departureDate);
  
  for (let i = 1; i <= daysToCheck; i++) {
    const prevDate = new Date(originalDate);
    prevDate.setDate(originalDate.getDate() - i);
    alternativeDates.push(prevDate.toISOString().split('T')[0]);
    
    const nextDate = new Date(originalDate);
    nextDate.setDate(originalDate.getDate() + i);
    alternativeDates.push(nextDate.toISOString().split('T')[0]);
  }

  const searchPromises = alternativeDates.map(date => {
    const params = { ...originalParams, departureDate: date };
    return flightApiService.searchFlights(params)
      .then(results => ({ date, results }))
      .catch(() => ({ date, results: { flights: [], totalResults: 0, searchId: '' } }));
  });

  const allResults = await Promise.all(searchPromises);
  
  const validResults = allResults.filter(result => 
    result.results.flights.length > 0
  );

  validResults.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const diffA = Math.abs(dateA.getTime() - originalDate.getTime());
    const diffB = Math.abs(dateB.getTime() - originalDate.getTime());
    return diffA - diffB;
  });

  const response: {
    originalDate: string;
    foundResults: AlternativeFlightSearchResult[];
    message?: string;
  } = {
    originalDate: originalParams.departureDate,
    foundResults: validResults
  };

  if (validResults.length > 0 && validResults[0].date !== originalParams.departureDate) {
    response.message = `No flights found for ${originalParams.departureDate}, but here are some alternatives.`;
  }

  return response;
}

export const flightApiService = new FlightApiService();