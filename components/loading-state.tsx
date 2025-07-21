import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Plane } from "lucide-react"
import styles from "./loading-state.module.css"

// Update the component to use the new CSS classes
export function LoadingState() {
  return (
    <div className={styles.loadingContainer}>
      {/* Loading Header */}
      <Card>
        <CardContent className={styles.loadingHeader}>
          <Plane className={styles.loadingIcon} />
          <span className={styles.loadingText}>Searching for flights...</span>
        </CardContent>
      </Card>

      {/* Loading Cards */}
      {[1, 2, 3].map((i) => (
        <Card key={i} className={styles.loadingCard}>
          <CardContent>
            <div className={styles.loadingContent}>
              <div className={styles.loadingSection}>
                {/* Airline skeleton */}
                <div className={styles.loadingAirline}>
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>

                {/* Route skeleton */}
                <div className={styles.loadingRoute}>
                  <div className={styles.loadingRouteSection}>
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-3 w-20" />
                  </div>

                  <div className={styles.loadingRouteCenter}>
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-px w-full" />
                    <Skeleton className="h-3 w-12" />
                  </div>

                  <div className={styles.loadingRouteSection}>
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>

                {/* Additional info skeleton */}
                <div className={styles.loadingInfo}>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              {/* Price skeleton */}
              <div className={styles.loadingPrice}>
                <div className={styles.loadingPriceSection}>
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
