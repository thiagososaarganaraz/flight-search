"use client"

import type { FlightSearchResponse } from "@/types/flight"
import { FlightCard } from "./flight-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plane } from "lucide-react"

interface FlightResultsProps {
  results: FlightSearchResponse
  onFlightSelect?: (flight: any) => void
}

export function FlightResults({ results, onFlightSelect }: FlightResultsProps) {
  if (!results.flights.length) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <Plane className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No flights found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria or dates to find more options.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Results Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Flight Results
            </span>
            <Badge variant="secondary">
              {results.totalResults} flight{results.totalResults !== 1 ? "s" : ""} found
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Flight Cards */}
      <div className="space-y-3">
        {results.flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} onSelect={onFlightSelect} />
        ))}
      </div>
    </div>
  )
}
