"use client"

import type React from "react"
import { useState } from "react"
import { DatePicker } from "@/components/ui/date-picker"
import type { FlightSearchParams } from "@/types/flight"
import { Plane, Users, Calendar } from "lucide-react"
import { format } from "date-fns"
import { AirportAutocomplete } from "./airport-autocomplete"
import styles from "./flight-search-form.module.css"

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
    <div className={styles.searchFormCard}>
      <div className={styles.formContent}>
        <form onSubmit={handleSubmit} className={styles.formSection}>
          {/* Trip Type */}
          <div className={styles.tripTypeSection}>
            <div className={styles.radioGroup}>
              <input
                type="radio"
                id="round-trip"
                name="tripType"
                value="round_trip"
                checked={formData.tripType === "round_trip"}
                onChange={(e) => setFormData((prev) => ({ ...prev, tripType: e.target.value as "round_trip" }))}
                className={styles.radioInput}
              />
              <label htmlFor="round-trip" className={styles.radioLabel}>
                Round trip
              </label>
            </div>
            <div className={styles.radioGroup}>
              <input
                type="radio"
                id="one-way"
                name="tripType"
                value="one_way"
                checked={formData.tripType === "one_way"}
                onChange={(e) => setFormData((prev) => ({ ...prev, tripType: e.target.value as "one_way" }))}
                className={styles.radioInput}
              />
              <label htmlFor="one-way" className={styles.radioLabel}>
                One way
              </label>
            </div>
          </div>

          {/* Origin and Destination */}
          <div className={styles.inputGrid}>
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
          <div className={styles.inputGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <Calendar className={styles.labelIcon} />
                Departure
              </label>
              <DatePicker date={departureDate} placeholder="Select departure date" />
            </div>
            {formData.tripType === "round_trip" && (
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <Calendar className={styles.labelIcon} />
                  Return
                </label>
                <DatePicker date={returnDate} placeholder="Select return date" />
              </div>
            )}
          </div>

          {/* Passengers and Class */}
          <div className={styles.inputGrid}>
            <div className={styles.passengersSection}>
              <label className={styles.passengersLabel}>
                <Users className={styles.labelIcon} />
                Passengers
              </label>
              <div className={styles.passengersGrid}>
                <div className={styles.passengerGroup}>
                  <label htmlFor="adults" className={styles.passengerLabel}>
                    Adults
                  </label>
                  <select
                    id="adults"
                    value={formData.adults?.toString()}
                    onChange={(e) => setFormData((prev) => ({ ...prev, adults: Number.parseInt(e.target.value) }))}
                    className={styles.selectInput}
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num.toString()}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.passengerGroup}>
                  <label htmlFor="children" className={styles.passengerLabel}>
                    Children
                  </label>
                  <select
                    id="children"
                    value={formData.children?.toString()}
                    onChange={(e) => setFormData((prev) => ({ ...prev, children: Number.parseInt(e.target.value) }))}
                    className={styles.selectInput}
                  >
                    {[0, 1, 2, 3, 4].map((num) => (
                      <option key={num} value={num.toString()}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.passengerGroup}>
                  <label htmlFor="infants" className={styles.passengerLabel}>
                    Infants
                  </label>
                  <select
                    id="infants"
                    value={formData.infants?.toString()}
                    onChange={(e) => setFormData((prev) => ({ ...prev, infants: Number.parseInt(e.target.value) }))}
                    className={styles.selectInput}
                  >
                    {[0, 1, 2].map((num) => (
                      <option key={num} value={num.toString()}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className={styles.classSection}>
              <label htmlFor="class" className={styles.classLabel}>
                Class
              </label>
              <select
                id="class"
                value={formData.cabinClass}
                onChange={(e) => setFormData((prev) => ({ ...prev, cabinClass: e.target.value as any }))}
                className={styles.selectInput}
              >
                <option value="economy">Economy</option>
                <option value="premium_economy">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading || !formData.origin || !formData.destination || !departureDate}
          >
            {loading
              ? "Searching..."
              : `Search Flights (${totalPassengers} passenger${totalPassengers !== 1 ? "s" : ""})`}
          </button>
        </form>
      </div>
    </div>
  )
}
