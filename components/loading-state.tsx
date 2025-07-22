import { Plane } from "lucide-react"
import styles from "./loading-state.module.css"

export function LoadingState() {
  return (
    <div className={styles.loadingContainer}>
      {/* Loading Header */}
      <div className={styles.loadingHeaderCard}>
        <div className={styles.loadingHeader}>
          <Plane className={`${styles.loadingIcon} animate-pulse-slow`} />
          <span className={styles.loadingText}>Searching for flights...</span>
        </div>
      </div>

      {/* Loading Cards */}
      {[1, 2, 3].map((i) => (
        <div key={i} className={styles.loadingCard}>
          <div className={styles.loadingCardContent}>
            <div className={styles.loadingContent}>
              <div className={styles.loadingSection}>
                {/* Airline skeleton */}
                <div className={styles.loadingAirline}>
                  <div
                    className={`${styles.skeleton} ${styles.skeletonW8} ${styles.skeletonH8} ${styles.skeletonRounded}`}
                  ></div>
                  <div className={`${styles.skeleton} ${styles.skeletonH4} ${styles.skeletonW32}`}></div>
                  <div className={`${styles.skeleton} ${styles.skeletonH4} ${styles.skeletonW16}`}></div>
                </div>

                {/* Route skeleton */}
                <div className={styles.loadingRoute}>
                  <div className={styles.loadingRouteSection}>
                    <div className={`${styles.skeleton} ${styles.skeletonH8} ${styles.skeletonW16}`}></div>
                    <div className={`${styles.skeleton} ${styles.skeletonH4} ${styles.skeletonW12}`}></div>
                    <div className={`${styles.skeleton} ${styles.skeletonH3} ${styles.skeletonW20}`}></div>
                  </div>

                  <div className={styles.loadingRouteCenter}>
                    <div className={`${styles.skeleton} ${styles.skeletonH4} ${styles.skeletonW16}`}></div>
                    <div className={`${styles.skeleton} ${styles.skeletonHPx} ${styles.skeletonWFull}`}></div>
                    <div className={`${styles.skeleton} ${styles.skeletonH3} ${styles.skeletonW12}`}></div>
                  </div>

                  <div className={styles.loadingRouteSection}>
                    <div className={`${styles.skeleton} ${styles.skeletonH8} ${styles.skeletonW16}`}></div>
                    <div className={`${styles.skeleton} ${styles.skeletonH4} ${styles.skeletonW12}`}></div>
                    <div className={`${styles.skeleton} ${styles.skeletonH3} ${styles.skeletonW20}`}></div>
                  </div>
                </div>

                {/* Additional info skeleton */}
                <div className={styles.loadingInfo}>
                  <div className={`${styles.skeleton} ${styles.skeletonH4} ${styles.skeletonW20}`}></div>
                  <div className={`${styles.skeleton} ${styles.skeletonH4} ${styles.skeletonW24}`}></div>
                </div>
              </div>

              {/* Price skeleton */}
              <div className={styles.loadingPrice}>
                <div className={styles.loadingPriceSection}>
                  <div className={`${styles.skeleton} ${styles.skeletonH8} ${styles.skeletonW20}`}></div>
                  <div className={`${styles.skeleton} ${styles.skeletonH4} ${styles.skeletonW16}`}></div>
                </div>
                <div className={`${styles.skeleton} ${styles.skeletonH10} ${styles.skeletonW24}`}></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
