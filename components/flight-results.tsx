"use client"

import type { FlightSearchResponse } from "@/types/flight"
import { FlightCard } from "./flight-card"
import { Plane } from "lucide-react"
import styles from "./flight-results.module.css"

interface FlightResultsProps {
  results: FlightSearchResponse
  onFlightSelect?: (flight: any) => void
}

export function FlightResults({ results, onFlightSelect }: FlightResultsProps) {
  if (!results.flights.length) {
    return (
      <div className={styles.noResultsCard}>
        <div className={styles.noResults}>
          <Plane className={styles.noResultsIcon} />
          <h3 className={styles.noResultsTitle}>No flights found</h3>
          <p className={styles.noResultsText}>Try adjusting your search criteria or dates to find more options.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.resultsContainer}>
      {/* Results Header */}
      <div className={styles.resultsHeaderCard}>
        <div className={styles.resultsHeaderContent}>
          <div className={styles.resultsTitle}>
            <span className={styles.resultsTitleText}>
              <Plane className={styles.resultsTitleIcon} />
              Top departing flights
            </span>
            <div className={styles.resultsCount}>
              {results.totalResults} flight{results.totalResults !== 1 ? "s" : ""} found
            </div>
          </div>
        </div>
      </div>

      {/* Flight Cards */}
      <div className={styles.flightsList}>
        {results.flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} onSelect={onFlightSelect} />
        ))}
      </div>
    </div>
  )
}
