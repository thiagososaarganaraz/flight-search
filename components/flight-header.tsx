"use client"

import Image from "next/image"
import styles from "./flight-header.module.css"
import logoLight from "@/public/flights_light.svg"
import logoDark from "@/public/flights_dark.svg"

type FlightHeaderProps = {
  theme: "light" | "dark"
}

export function FlightHeader({ theme }: FlightHeaderProps) {
  return (
    <div className={styles.formHeader}>
      <div className={styles.logoContainer}>
        <Image
          src={theme === "dark" ? logoDark : logoLight}
          alt="Flight Logo"
          className={styles.logoImage}
          priority
          width={1200}
        />
      </div>
      <h2 className={styles.formTitle}>Flights</h2>
    </div>
  )
}