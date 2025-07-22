"use client"

import { useEffect, useState } from "react"

export function ThemeDebug() {
  const [mounted, setMounted] = useState(false)
  const [themeInfo, setThemeInfo] = useState({
    storage: "",
    htmlClass: "",
    dataTheme: "",
  })

  useEffect(() => {
    setMounted(true)

    const updateThemeInfo = () => {
      if (typeof window !== "undefined") {
        setThemeInfo({
          storage: localStorage.getItem("flight-search-theme") || "none",
          htmlClass: document.documentElement.className,
          dataTheme: document.documentElement.getAttribute("data-theme") || "none",
        })
      }
    }

    updateThemeInfo()

    // Update every second to show changes
    const interval = setInterval(updateThemeInfo, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1rem",
        left: "1rem",
        padding: "0.5rem",
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "0.375rem",
        fontSize: "0.75rem",
        color: "var(--card-foreground)",
        zIndex: 1000,
        fontFamily: "monospace",
        maxWidth: "200px",
      }}
    >
      <div>
        <strong>Theme Debug:</strong>
      </div>
      <div>Storage: {themeInfo.storage}</div>
      <div>HTML Class: {themeInfo.htmlClass}</div>
      <div>Data Theme: {themeInfo.dataTheme}</div>
    </div>
  )
}
