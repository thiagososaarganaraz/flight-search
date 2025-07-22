"use client"

import { useState } from "react"
import { FlightSearchForm } from "@/components/flight-search-form"
import { FlightResults } from "@/components/flight-results"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { useFlightSearch } from "@/hooks/use-flight-search"
import type { FlightSearchParams } from "@/types/flight"
import { ThemeToggle } from "@/components/theme-toggle"
import styles from "./page.module.css"

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
    console.log("Selected flight:", flight)
    alert(`Selected flight ${flight.segments[0].flightNumber} for $${flight.price.amount}`)
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerInner}>
            <h1 className={styles.headerTitle}>Google Flights Copycat</h1>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.mainContent}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>
              Flights
            </h2>
          </div>
          {/* Search Form */}
          <FlightSearchForm onSearch={handleSearch} loading={loading} />

          {/* Results */}
          {loading && <LoadingState />}

          {error && <ErrorState error={error} onRetry={handleRetry} />}

          {data && !loading && !error && <FlightResults results={data} onFlightSelect={handleFlightSelect} />}
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerText}>
            <p>© 2025 Thiago Sosa Dev.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
