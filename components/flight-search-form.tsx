"use client"

import type React from "react"
import { useState } from "react"
import { DatePicker } from "@/components/ui/date-picker"
import type { FlightSearchParams } from "@/types/flight"
import { Users, Calendar, ArrowRightLeft, Search } from "lucide-react"
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

  const [departureDate, setDepartureDate] = useState<Date | null>(null)
  const [returnDate, setReturnDate] = useState<Date | null>(null)

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

  const handleSwapAirports = () => {
    setFormData((prev) => ({
      ...prev,
      origin: prev.destination || "",
      destination: prev.origin || "",
    }))
  }

  const totalPassengers = (formData.adults || 0) + (formData.children || 0) + (formData.infants || 0)

  return (
    <div className={styles.searchFormCard}>
      <div className={styles.formContent}>
        <form onSubmit={handleSubmit} className={styles.formSection}>
          {/* Top Row: Trip Type, Passengers, Class */}
          <div className={styles.topRow}>
            <div className={styles.topSection}>
              <select
                value={formData.tripType}
                onChange={(e) => setFormData((prev) => ({ ...prev, tripType: e.target.value as any }))}
                className={styles.topSelect}
              >
                <option value="round_trip">Ida y vuelta</option>
                <option value="one_way">Solo ida</option>
              </select>
            </div>

            <div className={styles.topSection}>
              <label className={styles.passengersCompact}>
                <Users className={styles.compactIcon} />
                <span>{totalPassengers}</span>
              </label>
            </div>

            <div className={styles.topSection}>
              <select
                value={formData.cabinClass}
                onChange={(e) => setFormData((prev) => ({ ...prev, cabinClass: e.target.value as any }))}
                className={styles.topSelect}
              >
                <option value="economy">Turista</option>
                <option value="premium_economy">Premium Turista</option>
                <option value="business">Negocios</option>
                <option value="first">Primera Clase</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Locations, Dates */}
          <div className={styles.bottomRow}>
            {/* Location Group */}
            <div className={styles.locationGroup}>
              <AirportAutocomplete
                value={formData.origin || ""}
                onChange={(value) => setFormData((prev) => ({ ...prev, origin: value }))}
                label="From"
                placeholder="Origen"
                required
                disabled={loading}
              />
              <button
                type="button"
                className={styles.swapButton}
                onClick={handleSwapAirports}
                disabled={loading}
                title="Intercambiar origen y destino"
              >
                <ArrowRightLeft className={styles.swapIcon} />
              </button>
              <AirportAutocomplete
                value={formData.destination || ""}
                onChange={(value) => setFormData((prev) => ({ ...prev, destination: value }))}
                label="To"
                placeholder="¿A dónde quieres ir?"
                required
                disabled={loading}
              />
            </div>

            {/* Dates Group */}
            <div className={styles.datesGroup}>
              <div className={styles.datePickerWrapper}>
                <DatePicker 
                  date={departureDate}
                  onDateChange={setDepartureDate}
                  placeholder="Salida"
                  disabled={loading}
                />
              </div>
              {formData.tripType === "round_trip" && (
                <>
                  <div className={styles.dateDivider}></div>
                  <div className={styles.datePickerWrapper}>
                    <DatePicker 
                      date={returnDate}
                      onDateChange={setReturnDate}
                      placeholder="Regreso"
                      disabled={loading}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </form>

        {/* Floating Search Button */}
        <button
          type="submit"
          className={styles.floatingSearchButton}
          // disabled={loading || !formData.origin || !formData.destination || !departureDate}
          onClick={handleSubmit}
        >
          <Search className={styles.searchIcon} />
          <span>Explorar</span>
        </button>
      </div>
    </div>
  )
}