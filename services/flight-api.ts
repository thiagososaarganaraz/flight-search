import type { FlightSearchParams, FlightSearchResponse, Flight } from "@/types/flight"

const API_BASE_URL = "https://sky-scrapper.p.rapidapi.com/api/v1"
const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || ""

class FlightApiService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
          "Content-Type": "application/json",
          ...options.headers,
        },
      })

      if (!response.ok) {
        // Handle different HTTP status codes
        switch (response.status) {
          case 400:
            throw new Error("Invalid search parameters. Please check your input and try again.")
          case 401:
            throw new Error("API authentication failed. Please check your API key.")
          case 403:
            throw new Error("Access forbidden. You may have exceeded your API quota.")
          case 404:
            throw new Error("Flight search service not found.")
          case 429:
            throw new Error("Too many requests. Please wait a moment and try again.")
          case 500:
            throw new Error("Flight search service is temporarily unavailable.")
          default:
            throw new Error(`Flight search failed: ${response.status} ${response.statusText}`)
        }
      }

      const data = await response.json()
      return data
    } catch (error) {
      // Handle network errors and other exceptions
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error. Please check your internet connection and try again.")
      }

      // Re-throw API errors with their specific messages
      if (error instanceof Error) {
        throw error
      }

      // Fallback for unknown errors
      throw new Error("An unexpected error occurred while searching for flights.")
    }
  }

  async searchFlights(params: FlightSearchParams): Promise<FlightSearchResponse> {
    try {
      // Validate input parameters
      if (!params.origin || !params.destination) {
        throw new Error("Origin and destination are required.")
      }

      if (!params.departureDate) {
        throw new Error("Departure date is required.")
      }

      if (params.adults < 1) {
        throw new Error("At least one adult passenger is required.")
      }

      // Mock implementation with realistic delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate occasional API errors for testing
      if (Math.random() < 0.1) {
        // 10% chance of error
        throw new Error("Flight search service is temporarily busy. Please try again.")
      }

      return this.getMockFlightData(params)
    } catch (error) {
      // Log error for debugging (in production, use proper logging service)
      console.error("Flight search error:", error)

      // Re-throw the error to be handled by the calling code
      throw error
    }
  }

  // Add method to validate airport codes
  private validateAirportCode(code: string): boolean {
    return /^[A-Z]{3}$/.test(code.toUpperCase())
  }

  // Enhanced mock data generation with error simulation
  private getMockFlightData(params: FlightSearchParams): FlightSearchResponse {
    try {
      // Extract airport codes from the input (handle "LAX - Los Angeles" format)
      const originCode = params.origin.split(" ")[0].toUpperCase()
      const destinationCode = params.destination.split(" ")[0].toUpperCase()

      // Validate airport codes
      if (!this.validateAirportCode(originCode) || !this.validateAirportCode(destinationCode)) {
        throw new Error("Invalid airport code format. Please use 3-letter airport codes.")
      }

      if (originCode === destinationCode) {
        throw new Error("Origin and destination cannot be the same.")
      }

      const mockFlights: Flight[] = [
        {
          id: "1",
          segments: [
            {
              airline: "American Airlines",
              airlineCode: "AA",
              flightNumber: "AA1234",
              departure: {
                airport: { code: originCode, name: "Origin Airport", city: "Origin City", country: "USA" },
                time: "08:30",
                date: params.departureDate,
              },
              arrival: {
                airport: {
                  code: destinationCode,
                  name: "Destination Airport",
                  city: "Destination City",
                  country: "USA",
                },
                time: "17:15",
                date: params.departureDate,
              },
              duration: "5h 45m",
              aircraft: "Boeing 737-800",
            },
          ],
          totalDuration: "5h 45m",
          stops: 0,
          price: { amount: 299, currency: "USD" },
          airline: "American Airlines",
          airlineCode: "AA",
        },
        // ... other mock flights with similar updates
      ]

      return {
        flights: mockFlights,
        totalResults: mockFlights.length,
        searchId: "mock-search-" + Date.now(),
      }
    } catch (error) {
      throw error
    }
  }
}

export const flightApiService = new FlightApiService()
