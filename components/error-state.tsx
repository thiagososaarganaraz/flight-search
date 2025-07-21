"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, Clock, Shield } from "lucide-react"
import type { ApiError } from "@/types/flight"
import styles from "@/styles/components.module.css"

interface ErrorStateProps {
  error: ApiError
  onRetry?: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const getErrorIcon = () => {
    if (error.status === 429) return <Clock className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
    if (error.status === 403) return <Shield className="h-12 w-12 mx-auto text-orange-500 mb-4" />
    return <AlertCircle className="h-12 w-12 mx-auto mb-4" />
  }

  const getErrorTitle = () => {
    if (error.status === 429) return "Too Many Requests"
    if (error.status === 403) return "Access Restricted"
    if (error.status === 500) return "Service Unavailable"
    return "Something went wrong"
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-8 text-center">
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>{getErrorIcon()}</div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{getErrorTitle()}</h3>
          <p className={`${styles.errorText} mb-6`}>
            {error.message || "An unexpected error occurred while searching for flights."}
          </p>
          {onRetry && (
            <Button onClick={onRetry} className={`gap-2 ${styles.focusVisible}`}>
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
