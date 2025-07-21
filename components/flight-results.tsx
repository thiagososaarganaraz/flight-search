"use client"

import type { FlightSearchResponse } from "@/types/flight"
import { FlightCard } from "./flight-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plane } from "lucide-react"
import styles from "./flight-results.module.css"

interface FlightResultsProps {
  results: FlightSearchResponse
  onFlightSelect?: (flight: any) => void
}

export function FlightResults({ results, onFlightSelect }: FlightResultsProps) {
  if (!results.flights.length) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className={styles.noResults}>
          <Plane className={styles.noResultsIcon} />
          <h3 className={styles.noResultsTitle}>No flights found</h3>
          <p className={styles.noResultsText}>Try adjusting your search criteria or dates to find more options.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={styles.resultsContainer}>
      {/* Results Header */}
      <Card className={styles.resultsHeader}>
        <CardHeader>
          <CardTitle className={styles.resultsTitle}>
            <span className={styles.resultsTitleText}>
              <Plane className="h-5 w-5" />
              Flight Results
            </span>
            <Badge variant="secondary" className={styles.resultsCount}>
              {results.totalResults} flight{results.totalResults !== 1 ? "s" : ""} found
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Flight Cards */}
      <div className={styles.flightsList}>
        {results.flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} onSelect={onFlightSelect} />
        ))}
      </div>
    </div>
  )
}
