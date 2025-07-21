"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Flight } from "@/types/flight"
import { Clock, Plane, MapPin } from "lucide-react"
import styles from "@/styles/components.module.css"

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
      <div className="p-6">
        <div className={styles.mobileStack}>
          {/* Flight Info */}
          <div className="flex-1 space-y-4">
            {/* Airline */}
            <div className="flex items-center gap-2">
              <div className={styles.airlineIcon}>
                <Plane className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-medium text-gray-900 dark:text-gray-100">{flight.airline}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{segment.flightNumber}</span>
            </div>

            {/* Route and Times */}
            <div className="flex items-center gap-4">
              <div className={styles.mobileCenter}>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatTime(segment.departure.time)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{segment.departure.airport.code}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500">{segment.departure.airport.city}</div>
              </div>

              <div className="flex-1 flex flex-col items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{flight.totalDuration}</div>
                <div className={styles.routeLine}>
                  <div className={styles.routeDot}></div>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{getStopsText(flight.stops)}</div>
              </div>

              <div className={styles.mobileCenter}>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatTime(segment.arrival.time)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{segment.arrival.airport.code}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500">{segment.arrival.airport.city}</div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {segment.duration}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {segment.aircraft}
              </div>
            </div>
          </div>

          {/* Price and Action */}
          <div className="flex flex-col items-end gap-3 lg:min-w-[120px]">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">${flight.price.amount}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">per person</div>
            </div>

            {flight.stops === 0 && (
              <Badge variant="secondary" className="text-xs">
                Nonstop
              </Badge>
            )}

            <Button onClick={() => onSelect?.(flight)} className={`w-full lg:w-auto ${styles.focusVisible}`}>
              Select
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
