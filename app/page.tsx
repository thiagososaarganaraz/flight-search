"use client"

import { useState, useEffect } from "react"
import { FlightSearchForm } from "@/components/flight-search-form"
import { FlightRecommendations } from "@/components/flight-recommendations"
import { FlightResults } from "@/components/flight-results"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { useFlightSearch } from "@/hooks/use-flight-search"
import type { FlightSearchParams } from "@/types/flight"
import { ThemeToggle } from "@/components/theme-toggle"
import styles from "./page.module.css"
import { FlightHeader } from "@/components/flight-header"

export default function HomePage() {
  const { data, loading, error, searchFlights, clearResults } = useFlightSearch()
  const [lastSearchParams, setLastSearchParams] = useState<FlightSearchParams | null>(null)
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light")

  // Efecto para manejar el tema
  useEffect(() => {
    const updateTheme = () => {
      try {
        const savedTheme = localStorage.getItem("flight-search-theme") as "light" | "dark" | null
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        const theme = savedTheme || (systemPrefersDark ? "dark" : "light")
        setCurrentTheme(theme)
      } catch (e) {
        console.error("Error accessing localStorage:", e)
        setCurrentTheme("light")
      }
    }

    // Configurar listeners
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "flight-search-theme") {
        updateTheme()
      }
    }

    // ✅ Escuchar nuestro evento personalizado
    const handleCustomThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<"light" | "dark">;
      setCurrentTheme(customEvent.detail);
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleSystemThemeChange = () => {
      if (!localStorage.getItem("flight-search-theme")) {
        updateTheme()
      }
    }

    // Inicializar
    updateTheme()
    
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("theme-changed", handleCustomThemeChange) // ✅ Agregamos el listener
    mediaQuery.addListener(handleSystemThemeChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("theme-changed", handleCustomThemeChange) // ✅ Lo limpiamos
      mediaQuery.removeListener(handleSystemThemeChange)
    }
  }, [])

  const handleSearch = async (params: FlightSearchParams) => {
    setLastSearchParams(params)
    console.log("Searching flights with params:", params)
    await searchFlights(params)
  }

  const handleRetry = () => {
    if (lastSearchParams) {
      searchFlights(lastSearchParams)
    }
  }

  const handleFlightSelect = (flight: any) => {
    // alert(`Selected flight ${flight.segments[0].flightNumber} for $${flight.price.amount}`)
  }

  return (
    <div className={styles.pageContainer} data-theme={currentTheme}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerInner}>
            <h1 className={styles.headerTitle}>Google Flights Copycat</h1>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Flight Header - Full Width */}
      <FlightHeader theme={currentTheme} />

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.mainContent}>
          {/* Search Form */}
          <FlightSearchForm onSearch={handleSearch} loading={loading} />

          {/* Results */}
          {loading && <LoadingState />}
          {error && <ErrorState error={error} onRetry={handleRetry} />}
          {data && !loading && !error && (
            <FlightResults results={data} onFlightSelect={handleFlightSelect} />
          )}

          {/* Recommendations - Show when no search has been performed */}
          {!lastSearchParams && !loading && !error && !data && (
            <FlightRecommendations />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerText}>
            <p>© 2025 Thiago Frontend Engineer.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}