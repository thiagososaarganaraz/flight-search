export interface Airport {
  code: string
  name: string
  city: string
  country: string
}

export interface FlightSegment {
  airline: string
  airlineCode: string
  flightNumber: string
  departure: {
    airport: Airport
    time: string
    date: string
  }
  arrival: {
    airport: Airport
    time: string
    date: string
  }
  duration: string
  aircraft: string
}

export interface Flight {
  id: string
  segments: FlightSegment[]
  totalDuration: string
  stops: number
  price: {
    amount: number
    currency: string
  }
  airline: string
  airlineCode: string
  bookingUrl?: string
}

export interface FlightSearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  adults: number
  children: number
  infants: number
  cabinClass: "economy" | "premium_economy" | "business" | "first"
  tripType: "one_way" | "round_trip"
}

export interface FlightSearchResponse {
  flights: Flight[]
  totalResults: number
  searchId: string
}

export interface ApiError {
  message: string
  code?: string
  status?: number
}
