"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { DatePicker, StaticCalendar } from "@/components/ui/date-picker"
import type { FlightSearchParams } from "@/types/flight"
import { addMonths, format } from "date-fns"
import { AirportAutocomplete } from "./airport-autocomplete"
import styles from "./flight-search-form.module.css"
import { Users, ArrowRightLeft, ChevronDown, Check, Search } from 'lucide-react';

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
  const [returnDate, setReturnDate] = useState<Date | null>(addMonths(new Date(), 1))
  
  const [isTripTypeOpen, setIsTripTypeOpen] = useState(false);
  const [isPassengersOpen, setIsPassengersOpen] = useState(false);
  const [isCabinClassOpen, setIsCabinClassOpen] = useState(false);

  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  const tripTypeRef = useRef<HTMLDivElement>(null);
  const passengersRef = useRef<HTMLDivElement>(null);
  const cabinClassRef = useRef<HTMLDivElement>(null);
  const dateModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!(event.target instanceof Node)) return;

      // 2. Ahora evaluamos cada menú con total seguridad
      if (tripTypeRef.current && !tripTypeRef.current.contains(event.target)) {
        setIsTripTypeOpen(false);
      }
      if (passengersRef.current && !passengersRef.current.contains(event.target)) {
        setIsPassengersOpen(false);
      }
      if (cabinClassRef.current && !cabinClassRef.current.contains(event.target)) {
        setIsCabinClassOpen(false);
      }
      if (dateModalRef.current && !dateModalRef.current.contains(event.target)) {
        setIsDateModalOpen(false);
      }
    }

    // Escuchamos el evento mousedown (cuando se presiona el clic)
    document.addEventListener("mousedown", handleClickOutside);
    
    // Limpieza del listener cuando el componente se desmonta
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Si el usuario elige una salida que es posterior al regreso actual,
    // movemos el regreso un mes después de la nueva salida automáticamente.
    if (departureDate && returnDate && departureDate > returnDate) {
      setReturnDate(addMonths(departureDate, 1));
    }
  }, [departureDate]);

  const cabinClassMap = {
    economy: "Turista",
    premium_economy: "Premium Turista",
    business: "Negocios",
    first: "Primera Clase"
  };

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
            
            {/* --- 1. Tipo de Viaje --- */}
            <div className={styles.topSection}>
              <div className={styles.customDropdownContainer} ref={tripTypeRef}>
                <button
                  type="button"
                  className={`${styles.dropdownTrigger} ${isTripTypeOpen ? styles.triggerActive : ''}`}
                  onClick={() => setIsTripTypeOpen(!isTripTypeOpen)}
                >
                  <ArrowRightLeft className={styles.compactIcon} />
                  <span>{formData.tripType === 'round_trip' ? 'Ida y vuelta' : 'Solo ida'}</span>
                  <ChevronDown className={styles.compactIcon} />
                </button>

                {isTripTypeOpen && (
                  <div className={styles.dropdownMenu}>
                    <div
                      className={styles.dropdownItem}
                      onClick={() => { 
                        setFormData((prev) => ({ ...prev, tripType: 'round_trip' })); 
                        setIsTripTypeOpen(false); 
                      }}
                    >
                      <span className={styles.checkIcon}>
                        {formData.tripType === 'round_trip' && <Check size={16} />}
                      </span>
                      Ida y vuelta
                    </div>
                    
                    <div
                      className={styles.dropdownItem}
                      onClick={() => { 
                        setFormData((prev) => ({ ...prev, tripType: 'one_way' })); 
                        setIsTripTypeOpen(false); 
                      }}
                    >
                      <span className={styles.checkIcon}>
                        {formData.tripType === 'one_way' && <Check size={16} />}
                      </span>
                      Solo ida
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* --- 2. Pasajeros --- */}
            <div className={styles.topSection}>
              <div className={styles.customDropdownContainer} ref={passengersRef}>
                <button
                  type="button"
                  className={`${styles.dropdownTrigger} ${isPassengersOpen ? styles.triggerActive : ''}`}
                  onClick={() => setIsPassengersOpen(!isPassengersOpen)}
                >
                  <Users className={styles.compactIcon} />
                  <span>{totalPassengers}</span>
                  <ChevronDown className={styles.compactIcon} />
                </button>

                {isPassengersOpen && (
                  <div className={styles.dropdownMenu} style={{ minWidth: '220px', padding: '16px' }}>
                    <div className={styles.counterRow}>
                      <span className={styles.counterLabel}>Adultos</span>
                      <div className={styles.counterControls}>
                        <button 
                          type="button" 
                          className={styles.counterBtn}
                        >
                          -
                        </button>
                        <span className={styles.counterValue}>1</span>
                        <button 
                          type="button" 
                          className={styles.counterBtn}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* --- 3. Clase de Cabina --- */}
            <div className={styles.topSection}>
              <div className={styles.customDropdownContainer} ref={cabinClassRef}>
                <button
                  type="button"
                  className={`${styles.dropdownTrigger} ${isCabinClassOpen ? styles.triggerActive : ''}`}
                  onClick={() => setIsCabinClassOpen(!isCabinClassOpen)}
                >
                  <span>{cabinClassMap[formData.cabinClass as keyof typeof cabinClassMap] || "Turista"}</span>
                  <ChevronDown className={styles.compactIcon} />
                </button>

                {isCabinClassOpen && (
                  <div className={styles.dropdownMenu}>
                    {Object.entries(cabinClassMap).map(([value, label]) => (
                      <div
                        key={value}
                        className={styles.dropdownItem}
                        onClick={() => {
                          setFormData((prev) => ({ 
                            ...prev, 
                            cabinClass: value as "economy" | "premium_economy" | "business" | "first" 
                          }));
                          setIsCabinClassOpen(false); 
                        }}
                      >
                        <span className={styles.checkIcon}>
                          {formData.cabinClass === value && <Check size={16} />}
                        </span>
                        {label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div> {/* <---- ESTE DIV FALTABA PARA CERRAR EL topRow */}

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

            {/* Dates Group Container */}
            <div className={styles.datesContainerWrapper} ref={dateModalRef}>
              
              {/* El gatillo visual (Parecen inputs, pero actúan como un gran botón) */}
              <div 
                className={`${styles.datesGroup} ${isDateModalOpen ? styles.datesGroupActive : ''}`}
                onClick={() => setIsDateModalOpen(true)}
              >
                <div className={styles.dateDisplay}>
                  <span className={!departureDate ? styles.placeholder : ''}>
                    {departureDate ? format(departureDate, "dd/MM/yyyy") : "Salida"}
                  </span>
                </div>

                {formData.tripType === "round_trip" && (
                  <>
                    <div className={styles.dateDivider}></div>
                    <div className={styles.dateDisplay}>
                      <span className={!returnDate ? styles.placeholder : ''}>
                        {returnDate ? format(returnDate, "dd/MM/yyyy") : "Regreso"}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* EL MODAL GIGANTE DE GOOGLE FLIGHTS */}
              {isDateModalOpen && (
                <div className={styles.dateModalGigante}>
                  
                  {/* Cabecera del Modal (Opciones y réplica de inputs) */}
                  <div className={styles.dateModalHeader}>
                    <div className={styles.dateModalHeaderLeft}>
                      <span className={styles.modalTripType}>Ida y vuelta</span>
                    </div>
                    <button 
                      type="button" 
                      className={styles.resetDateButton}
                      onClick={() => { setDepartureDate(null); setReturnDate(null); }}
                    >
                      Restablecer
                    </button>
                    <div className={styles.modalInputsBox}>
                      {/* Aquí adentro pondrías tus componentes <DatePicker> reales configurados 
                          para que SIEMPRE se muestren abiertos (modo estático), o tu librería 
                          de DateRangePicker */}
                      <div className={styles.modalInputFake}>Salida</div>
                      <div className={styles.modalInputFake}>Regreso</div>
                    </div>
                  </div>

                  {/* Zona del Calendario Doble */}
                  <div className={styles.calendarsWrapper}>
                    <div className={styles.doubleCalendarLayout}>
                      
                      {/* Calendario de Salida */}
                      <div className={styles.calendarColumn}>
                        <StaticCalendar 
                          date={departureDate}
                          onDateChange={(newDate) => {
                            setDepartureDate(newDate);
                            if (returnDate && newDate && newDate > returnDate) {
                              setReturnDate(null);
                            }
                          }}
                          departureDate={departureDate}
                          returnDate={formData.tripType === "round_trip" ? returnDate : null}
                        />
                      </div>

                      {/* Calendario de Regreso */}
                      {formData.tripType === "round_trip" && (
                        <div className={styles.calendarColumn}>
                          <StaticCalendar 
                            date={returnDate}
                            onDateChange={setReturnDate}
                            minDate={departureDate || new Date()} 
                            departureDate={departureDate}
                            returnDate={returnDate}
                            // MAGIA: El calendario se abre en el mes próximo, pero returnDate sigue siendo null
                            defaultMonth={addMonths(new Date(), 1)} 
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer del Modal */}
                  <div className={styles.dateModalFooter}>
                    <button 
                      type="button" 
                      className={styles.doneButton}
                      onClick={() => setIsDateModalOpen(false)}
                    >
                      Listo
                    </button>
                  </div>

                </div>
              )}
            </div>
          </div>
        </form>

        {/* Floating Search Button */}
        <button
          type="submit"
          className={styles.floatingSearchButton}
          onClick={handleSubmit}
        >
          <Search className={styles.searchIcon} />
          <span>Explorar</span>
        </button>
      </div>
    </div>
  )
}