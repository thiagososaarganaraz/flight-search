"use client"

import { useState, useEffect, useMemo } from "react"

export interface Airport {
  code: string
  name: string
  city: string
  country: string
}

// Mock airport data - in a real app, this would come from an API
const AIRPORTS: Airport[] = [
  { code: "LAX", name: "Los Angeles International Airport", city: "Los Angeles", country: "USA" },
  { code: "JFK", name: "John F. Kennedy International Airport", city: "New York", country: "USA" },
  { code: "LGA", name: "LaGuardia Airport", city: "New York", country: "USA" },
  { code: "EWR", name: "Newark Liberty International Airport", city: "Newark", country: "USA" },
  { code: "ORD", name: "O'Hare International Airport", city: "Chicago", country: "USA" },
  { code: "MDW", name: "Chicago Midway International Airport", city: "Chicago", country: "USA" },
  { code: "DFW", name: "Dallas/Fort Worth International Airport", city: "Dallas", country: "USA" },
  { code: "DEN", name: "Denver International Airport", city: "Denver", country: "USA" },
  { code: "ATL", name: "Hartsfield-Jackson Atlanta International Airport", city: "Atlanta", country: "USA" },
  { code: "MIA", name: "Miami International Airport", city: "Miami", country: "USA" },
  { code: "SFO", name: "San Francisco International Airport", city: "San Francisco", country: "USA" },
  { code: "SEA", name: "Seattle-Tacoma International Airport", city: "Seattle", country: "USA" },
  { code: "LAS", name: "McCarran International Airport", city: "Las Vegas", country: "USA" },
  { code: "PHX", name: "Phoenix Sky Harbor International Airport", city: "Phoenix", country: "USA" },
  { code: "BOS", name: "Logan International Airport", city: "Boston", country: "USA" },
  { code: "IAD", name: "Washington Dulles International Airport", city: "Washington", country: "USA" },
  { code: "DCA", name: "Ronald Reagan Washington National Airport", city: "Washington", country: "USA" },
  { code: "BWI", name: "Baltimore/Washington International Airport", city: "Baltimore", country: "USA" },
  { code: "MCO", name: "Orlando International Airport", city: "Orlando", country: "USA" },
  { code: "FLL", name: "Fort Lauderdale-Hollywood International Airport", city: "Fort Lauderdale", country: "USA" },
  { code: "LHR", name: "Heathrow Airport", city: "London", country: "UK" },
  { code: "LGW", name: "Gatwick Airport", city: "London", country: "UK" },
  { code: "CDG", name: "Charles de Gaulle Airport", city: "Paris", country: "France" },
  { code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany" },
  { code: "AMS", name: "Amsterdam Airport Schiphol", city: "Amsterdam", country: "Netherlands" },
  { code: "MAD", name: "Madrid-Barajas Airport", city: "Madrid", country: "Spain" },
  { code: "FCO", name: "Leonardo da Vinci International Airport", city: "Rome", country: "Italy" },
  { code: "ZUR", name: "Zurich Airport", city: "Zurich", country: "Switzerland" },
  { code: "VIE", name: "Vienna International Airport", city: "Vienna", country: "Austria" },
  { code: "CPH", name: "Copenhagen Airport", city: "Copenhagen", country: "Denmark" },
]

export function useAirportSearch() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Airport[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const searchAirports = useMemo(() => {
    return (searchQuery: string): Airport[] => {
      if (!searchQuery || searchQuery.length < 2) {
        return []
      }

      const normalizedQuery = searchQuery.toLowerCase().trim()

      return AIRPORTS.filter((airport) => {
        const searchableText = `${airport.code} ${airport.name} ${airport.city} ${airport.country}`.toLowerCase()
        return searchableText.includes(normalizedQuery)
      }).slice(0, 8) // Limit to 8 suggestions
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(true)
      const results = searchAirports(query)
      setSuggestions(results)
      setIsLoading(false)
    }, 150) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [query, searchAirports])

  return {
    query,
    setQuery,
    suggestions,
    isLoading,
    searchAirports,
  }
}
