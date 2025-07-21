"use client"

import { useState, useCallback } from "react"
import type { FlightSearchParams, FlightSearchResponse, ApiError } from "@/types/flight"
import { flightApiService } from "@/services/flight-api"

interface UseFlightSearchReturn {
  data: FlightSearchResponse | null
  loading: boolean
  error: ApiError | null
  searchFlights: (params: FlightSearchParams) => Promise<void>
  clearResults: () => void
}

export function useFlightSearch(): UseFlightSearchReturn {
  const [data, setData] = useState<FlightSearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const searchFlights = useCallback(async (params: FlightSearchParams) => {
    setLoading(true)
    setError(null)

    try {
      const response = await flightApiService.searchFlights(params)
      setData(response)
    } catch (err) {
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : "An unexpected error occurred",
        status: 500,
      }
      setError(apiError)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearResults = useCallback(() => {
    setData(null)
    setError(null)
  }, [])

  return {
    data,
    loading,
    error,
    searchFlights,
    clearResults,
  }
}
