"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import styles from "./theme-toggle.module.css"

export function ThemeToggle() {
  const [theme, setThemeState] = useState<"light" | "dark">("dark")
  const [mounted, setMounted] = useState(false)

  // Initialize theme
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("flight-search-theme") as "light" | "dark"
      if (savedTheme === "light" || savedTheme === "dark") {
        setThemeState(savedTheme)
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        setThemeState(prefersDark ? "dark" : "light")
      }
    } catch (error) {
      console.warn("Failed to read theme:", error)
      setThemeState("light")
    }
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"

    try {
      setThemeState(newTheme)
      localStorage.setItem("flight-search-theme", newTheme)
      
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(newTheme)
      document.documentElement.setAttribute("data-theme", newTheme)

      window.dispatchEvent(new CustomEvent("theme-changed", { detail: newTheme }))

    } catch (error) {
      console.error("Failed to toggle theme:", error)
    }
  }

  if (!mounted) {
    return (
      <button className={styles.themeToggleButton} aria-label="Toggle theme">
        <Sun className={`${styles.themeIcon} ${styles.sunIcon}`} />
      </button>
    )
  }

  return (
    // <button
    //   onClick={toggleTheme}
    //   className={styles.themeToggleButton}
    //   aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    //   type="button"
    // >
    //   {theme === "dark" ? (
    //     <Moon className={`${styles.themeIcon} ${styles.moonIcon}`} />
    //   ) : (
    //     <Sun className={`${styles.themeIcon} ${styles.sunIcon}`} />
    //   )}
    //   <span className="sr-only">{theme === "light" ? "Switch to dark mode" : "Switch to light mode"}</span>
    // </button>
    <></>
  )
}