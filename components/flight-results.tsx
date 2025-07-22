"use client"

import type { FlightSearchResponse } from "@/types/flight"
import { FlightCard } from "./flight-card"
import { Plane, Calendar } from "lucide-react"
import styles from "./flight-results.module.css"

interface AlternativeFlightResult {
  date: string;
  results: FlightSearchResponse;
}

interface FlightResultsProps {
  results: FlightSearchResponse | AlternativeFlightResult[];
  originalDate?: string;
  onFlightSelect?: (flight: any) => void;
  showDateHeaders?: boolean;
}

export function FlightResults({ 
  results, 
  originalDate, 
  onFlightSelect, 
  showDateHeaders = false 
}: FlightResultsProps) {
  // Check if we're showing alternative dates (array of results)
  const isAlternativeResults = Array.isArray(results);
  
  // Handle no results case
  if ((!isAlternativeResults && !results?.flights?.length) || 
      (isAlternativeResults && results.length === 0)) {
    return (
      <div className={styles.noResultsCard}>
        <div className={styles.noResults}>
          <Plane className={styles.noResultsIcon} />
          <h3 className={styles.noResultsTitle}>No flights found</h3>
          <p className={styles.noResultsText}>
            {originalDate ? `No flights available for ${originalDate}. ` : ''}
            Try adjusting your search criteria or dates to find more options.
          </p>
        </div>
      </div>
    )
  }

  // Single result set case
  if (!isAlternativeResults) {
    return (
      <div className={styles.resultsContainer}>
        <ResultsHeader 
          date={originalDate}
          totalResults={results.totalResults} 
        />
        <div className={styles.flightsList}>
          {results.flights.map((flight) => (
            <FlightCard key={flight.id} flight={flight} onSelect={onFlightSelect} />
          ))}
        </div>
      </div>
    )
  }

  // Multiple result sets (alternative dates) case
  return (
    <div className={styles.resultsContainer}>
      {originalDate && (
        <div className={styles.alternativeDatesNote}>
          <Calendar className={styles.calendarIcon} />
          Showing alternatives for {originalDate}
        </div>
      )}
      
      {results.map(({ date, results: resultSet }) => (
        <div key={date} className={styles.dateGroup}>
          {showDateHeaders && (
            <ResultsHeader 
              date={date}
              totalResults={resultSet.totalResults}
              isAlternative={true}
            />
          )}
          <div className={styles.flightsList}>
            {resultSet.flights.map((flight) => (
              <FlightCard key={`${date}-${flight.id}`} flight={flight} onSelect={onFlightSelect} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

interface ResultsHeaderProps {
  date?: string;
  totalResults: number;
  isAlternative?: boolean;
}

function ResultsHeader({ date, totalResults, isAlternative = false }: ResultsHeaderProps) {
  return (
    <div className={`${styles.resultsHeaderCard} ${isAlternative ? styles.alternativeHeader : ''}`}>
      <div className={styles.resultsHeaderContent}>
        <div className={styles.resultsTitle}>
          <span className={styles.resultsTitleText}>
            <Plane className={styles.resultsTitleIcon} />
            {date ? `Flights for ${date}` : 'Top departing flights'}
          </span>
          <div className={styles.resultsCount}>
            {totalResults} flight{totalResults !== 1 ? "s" : ""} found
          </div>
        </div>
      </div>
    </div>
  )
}