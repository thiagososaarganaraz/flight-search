"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import type { FlightSearchParams } from "@/types/flight"
import { Plane, Users, Calendar } from "lucide-react"
import { format } from "date-fns"
import { AirportAutocomplete } from "./airport-autocomplete"

interface FlightSearchFormProps {
  onSearch: (params: FlightSearchParams) => void
  loading?: boolean
}

export function FlightSearchForm({ onSearch, loading }: FlightSearchFormProps) {
  const [formData, setFormData] = useState<Partial<FlightSearchParams>>({
    origin: "",
    destination: "",
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: "economy",
    tripType: "round_trip",
  })

  const [departureDate, setDepartureDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.origin || !formData.destination || !departureDate) {
      return
    }

    const searchParams: FlightSearchParams = {
      origin: formData.origin,
      destination: formData.destination,
      departureDate: format(departureDate, "yyyy-MM-dd"),
      returnDate: returnDate ? format(returnDate, "yyyy-MM-dd") : undefined,
      adults: formData.adults || 1,
      children: formData.children || 0,
      infants: formData.infants || 0,
      cabinClass: formData.cabinClass || "economy",
      tripType: formData.tripType || "round_trip",
    }

    onSearch(searchParams)
  }

  const totalPassengers = (formData.adults || 0) + (formData.children || 0) + (formData.infants || 0)

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5" />
          Search Flights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Type */}
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="round-trip"
                name="tripType"
                value="round_trip"
                checked={formData.tripType === "round_trip"}
                onChange={(e) => setFormData((prev) => ({ ...prev, tripType: e.target.value as "round_trip" }))}
                className="w-4 h-4"
              />
              <Label htmlFor="round-trip">Round trip</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="one-way"
                name="tripType"
                value="one_way"
                checked={formData.tripType === "one_way"}
                onChange={(e) => setFormData((prev) => ({ ...prev, tripType: e.target.value as "one_way" }))}
                className="w-4 h-4"
              />
              <Label htmlFor="one-way">One way</Label>
            </div>
          </div>

          {/* Origin and Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AirportAutocomplete
              value={formData.origin || ""}
              onChange={(value) => setFormData((prev) => ({ ...prev, origin: value }))}
              label="From"
              placeholder="Origin airport (e.g., LAX)"
              required
              disabled={loading}
            />
            <AirportAutocomplete
              value={formData.destination || ""}
              onChange={(value) => setFormData((prev) => ({ ...prev, destination: value }))}
              label="To"
              placeholder="Destination airport (e.g., JFK)"
              required
              disabled={loading}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Departure
              </Label>
              <DatePicker date={departureDate} onDateChange={setDepartureDate} placeholder="Select departure date" />
            </div>
            {formData.tripType === "round_trip" && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Return
                </Label>
                <DatePicker date={returnDate} onDateChange={setReturnDate} placeholder="Select return date" />
              </div>
            )}
          </div>

          {/* Passengers and Class */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Passengers
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="adults" className="text-xs">
                    Adults
                  </Label>
                  <Select
                    value={formData.adults?.toString()}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, adults: Number.parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="children" className="text-xs">
                    Children
                  </Label>
                  <Select
                    value={formData.children?.toString()}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, children: Number.parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="infants" className="text-xs">
                    Infants
                  </Label>
                  <Select
                    value={formData.infants?.toString()}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, infants: Number.parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select
                value={formData.cabinClass}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, cabinClass: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="premium_economy">Premium Economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={loading || !formData.origin || !formData.destination || !departureDate}
          >
            {loading
              ? "Searching..."
              : `Search Flights (${totalPassengers} passenger${totalPassengers !== 1 ? "s" : ""})`}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
