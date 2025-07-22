"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useAirportSearch, type Airport } from "@/hooks/use-airport-search"
import { MapPin, Loader2 } from "lucide-react"
import styles from "./airport-autocomplete.module.css"

interface AirportAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  required?: boolean
  disabled?: boolean
}

export function AirportAutocomplete({
  value,
  onChange,
  placeholder = "Enter airport code or city",
  label,
  required = false,
  disabled = false,
}: AirportAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const { query, setQuery, suggestions, isLoading, error } = useAirportSearch()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setQuery(value)
    console.log(suggestions);
  }, [value, setQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setQuery(newValue)
    setIsOpen(true)
    setSelectedIndex(-1)
  }

  const handleSuggestionClick = (airport: Airport) => {
    const displayValue = `${airport.code} - ${airport.city}`
    onChange(displayValue)
    setQuery(displayValue)
    setIsOpen(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "ArrowDown" && suggestions.length > 0) {
        setIsOpen(true)
        setSelectedIndex(0)
        e.preventDefault()
      }
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex])
        }
        break
      case "Escape":
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const shouldShowDropdown = isOpen && (suggestions.length > 0 || isLoading || error)

  return (
    <div className={styles.autocompleteContainer}>
      {label && (
        <label htmlFor={`airport-${label}`} className={styles.label}>
          <MapPin className={styles.labelIcon} />
          {label}
        </label>
      )}

      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          id={label ? `airport-${label}` : undefined}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={styles.autocompleteInput}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
        />

        {isLoading && (
          <div className={styles.loadingSpinner}>
            <Loader2 className={`${styles.spinnerIcon} animate-spin`} />
          </div>
        )}
      </div>

      {shouldShowDropdown && (
        <div ref={dropdownRef} className={styles.autocompleteDropdown} role="listbox">
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingDots}>
                <div className={styles.loadingDot}></div>
                <div className={styles.loadingDot}></div>
                <div className={styles.loadingDot}></div>
              </div>
              <span className={styles.loadingText}>Searching airports...</span>
            </div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((airport, index) => (
              <div
                key={airport.code}
                id={`suggestion-${index}`}
                className={`${styles.autocompleteSuggestion} ${
                  index === selectedIndex ? "bg-blue-50 dark:bg-blue-900" : ""
                }`}
                onClick={() => handleSuggestionClick(airport)}
                role="option"
                aria-selected={index === selectedIndex}
                tabIndex={-1}
                style={
                  index === selectedIndex
                    ? {
                        backgroundColor: "var(--accent)",
                      }
                    : {}
                }
              >
                <div className={styles.suggestionContent}>
                  <div className={styles.suggestionInfo}>
                    <span className={styles.suggestionCode}>{airport?.code}</span>
                    <div className={styles.suggestionName}>{airport?.name}</div>
                    <div className={styles.suggestionLocation}>
                      {airport.city}, {airport.country}
                    </div>
                  </div>
                  <MapPin className={styles.suggestionIcon} />
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>No airports found</div>
          )}
        </div>
      )}
    </div>
  )
}
