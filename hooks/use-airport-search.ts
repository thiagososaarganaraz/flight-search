"use client"

import { useState, useEffect, useMemo } from "react"
import { flightApiService } from "@/services/flight-api"
import type { AirportSearchResult } from "@/types/flight"

export interface Airport {
  code: string
  name: string
  city: string
  country: string
  skyId?: string
  entityId?: string
}

export function useAirportSearch() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Airport[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchAirports = async (searchQuery: string): Promise<Airport[]> => {
    if (!searchQuery || searchQuery.length < 2) {
      return [];
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // La clase ya devuelve el formato correcto
      const apiResults = await flightApiService.searchAirports(searchQuery);
      
      return apiResults.slice(0, 8);
    } catch (err) {
      setError("Failed to search for airports. Please try again.");
      console.error("Airport search error:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize the search function
  const memoizedSearch = useMemo(() => searchAirports, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length >= 2) {
        memoizedSearch(query).then(results => {
          setSuggestions(results)
        })
      } else {
        setSuggestions([])
      }
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [query, memoizedSearch])

  return {
    query,
    setQuery,
    suggestions,
    isLoading,
    error,
    searchAirports: memoizedSearch,
  }
}