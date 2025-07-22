"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = "flight-search-theme"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    if (typeof document === "undefined") return

    const root = document.documentElement

    // Remove existing theme classes
    root.classList.remove("light", "dark")

    // Add new theme class
    root.classList.add(newTheme)

    // Set data attribute
    root.setAttribute("data-theme", newTheme)

    console.log(`Theme applied: ${newTheme}`)
  }

  // Set theme with persistence
  const setTheme = (newTheme: Theme) => {
    console.log(`Setting theme to: ${newTheme}`)
    setThemeState(newTheme)

    // Save to localStorage
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, newTheme)
      }
    } catch (error) {
      console.warn("Failed to save theme:", error)
    }

    applyTheme(newTheme)
  }

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
  }

  // Initialize theme on mount
  useEffect(() => {
    let initialTheme: Theme = "light"

    // Try to get saved theme
    try {
      if (typeof window !== "undefined") {
        const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme
        if (savedTheme === "light" || savedTheme === "dark") {
          initialTheme = savedTheme
        } else {
          // Check system preference
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
          initialTheme = prefersDark ? "dark" : "light"
        }
      }
    } catch (error) {
      console.warn("Failed to read theme:", error)
    }

    setThemeState(initialTheme)
    applyTheme(initialTheme)
    setMounted(true)

    console.log(`Theme initialized: ${initialTheme}`)
  }, [])

  // Don't render children until mounted to prevent hydration issues
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>
  }

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
