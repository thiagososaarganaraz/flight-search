"use client"

import type { Flight } from "@/types/flight"
import { Clock, Plane, MapPin } from "lucide-react"
import styles from "./flight-card.module.css"

interface FlightCardProps {
  flight: Flight
  onSelect?: (flight: Flight) => void
}

export function FlightCard({ flight, onSelect }: FlightCardProps) {
  const segment = flight.segments[0] // For simplicity, showing first segment

  const formatTime = (time: string) => {
    return time
  }

  const getStopsText = (stops: number) => {
    if (stops === 0) return "Nonstop"
    if (stops === 1) return "1 stop"
    return `${stops} stops`
  }

  return (
    <div className={styles.flightCard}>
      <div className={styles.cardContent}>
        <div className={styles.mobileStack}>
          {/* Flight Info */}
          <div className={styles.flightInfo}>
            {/* Airline */}
            <div className={styles.airlineSection}>
              <div className={styles.airlineIcon}>
                <Plane className={styles.airlineIconSvg} />
              </div>
              <span className={styles.airlineName}>{flight.airline}</span>
              <span className={styles.flightNumber}>{segment.flightNumber}</span>
            </div>

            {/* Route and Times */}
            <div className={styles.routeSection}>
              <div className={styles.timeInfo}>
                <div className={styles.departureTime}>{formatTime(segment.departure.time)}</div>
                <div className={styles.airportCode}>{segment.departure.airport.code}</div>
                <div className={styles.cityName}>{segment.departure.airport.city}</div>
              </div>

              <div className={styles.routeCenter}>
                <div className={styles.duration}>{flight.totalDuration}</div>
                <div className={styles.routeLine}>
                  <div className={styles.routeDot}></div>
                </div>
                <div className={styles.stopsInfo}>{getStopsText(flight.stops)}</div>
              </div>

              <div className={styles.timeInfo}>
                <div className={styles.arrivalTime}>{formatTime(segment.arrival.time)}</div>
                <div className={styles.airportCode}>{segment.arrival.airport.code}</div>
                <div className={styles.cityName}>{segment.arrival.airport.city}</div>
              </div>
            </div>

            {/* Additional Info */}
            <div className={styles.additionalInfo}>
              <div className={styles.infoItem}>
                <Clock className={styles.infoIcon} />
                {segment.duration}
              </div>
              <div className={styles.infoItem}>
                <MapPin className={styles.infoIcon} />
                {segment.aircraft}
              </div>
            </div>
          </div>

          {/* Price and Action */}
          <div className={styles.priceSection}>
            <div className={styles.priceInfo}>
              <div className={styles.price}>${flight.price.amount}</div>
              <div className={styles.priceLabel}>per person</div>
            </div>

            {flight.stops === 0 && <div className={styles.nonstopBadge}>Nonstop</div>}

            <button onClick={() => onSelect?.(flight)} className={styles.selectButton}>
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
