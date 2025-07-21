"use client"

import { useTheme } from "@/contexts/theme-context"
import { Moon, Sun } from "lucide-react"
import styles from "@/styles/components.module.css"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`${styles.themeToggle} ${styles.focusVisible}`}
      data-enabled={theme === "dark"}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      type="button"
    >
      <span className="sr-only">{theme === "light" ? "Switch to dark mode" : "Switch to light mode"}</span>

      <span className={styles.themeToggleButton} data-enabled={theme === "dark"}>
        {theme === "light" ? <Sun className="h-3 w-3 text-yellow-500" /> : <Moon className="h-3 w-3 text-blue-400" />}
      </span>
    </button>
  )
}
