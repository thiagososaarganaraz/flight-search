"use client"

import { useState } from "react"
import { FlightSearchForm } from "@/components/flight-search-form"
import { FlightResults } from "@/components/flight-results"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { useFlightSearch } from "@/hooks/use-flight-search"
import type { FlightSearchParams } from "@/types/flight"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  const { data, loading, error, searchFlights, clearResults } = useFlightSearch()
  const [lastSearchParams, setLastSearchParams] = useState<FlightSearchParams | null>(null)

  const handleSearch = async (params: FlightSearchParams) => {
    setLastSearchParams(params)
    await searchFlights(params)
  }

  const handleRetry = () => {
    if (lastSearchParams) {
      searchFlights(lastSearchParams)
    }
  }

  const handleFlightSelect = (flight: any) => {
    // In a real app, this would navigate to booking or show flight details
    console.log("Selected flight:", flight)
    alert(`Selected flight ${flight.segments[0].flightNumber} for $${flight.price.amount}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Flight Search</h1>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Search Form */}
          <FlightSearchForm onSearch={handleSearch} loading={loading} />

          {/* Results */}
          {loading && <LoadingState />}

          {error && <ErrorState error={error} onRetry={handleRetry} />}

          {data && !loading && !error && <FlightResults results={data} onFlightSelect={handleFlightSelect} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© 2024 Flight Search. Built with Next.js and TypeScript.</p>
            <p className="mt-2">This is a demo application. Flight data is mocked for demonstration purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
