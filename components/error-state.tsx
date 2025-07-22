"use client"

import { AlertCircle, RefreshCw, Clock, Shield } from "lucide-react"
import type { ApiError } from "@/types/flight"
import styles from "./error-state.module.css"

interface ErrorStateProps {
  error: ApiError
  onRetry?: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const getErrorIcon = () => {
    if (error.status === 429) return <Clock className={`${styles.errorIcon} ${styles.errorIconYellow}`} />
    if (error.status === 403) return <Shield className={`${styles.errorIcon} ${styles.errorIconOrange}`} />
    return <AlertCircle className={styles.errorIcon} />
  }

  const getErrorTitle = () => {
    if (error.status === 429) return "Too Many Requests"
    if (error.status === 403) return "Access Restricted"
    if (error.status === 500) return "Service Unavailable"
    return "Something went wrong"
  }

  return (
    <div className={styles.errorCard}>
      <div className={styles.errorContent}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIconContainer}>{getErrorIcon()}</div>
          <h3 className={styles.errorTitle}>{getErrorTitle()}</h3>
          <p className={styles.errorText}>
            {error.message || "An unexpected error occurred while searching for flights."}
          </p>
          {onRetry && (
            <button onClick={onRetry} className={styles.retryButton}>
              <RefreshCw className={styles.retryButtonIcon} />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
