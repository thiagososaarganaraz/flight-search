"use client"

import type React from "react"
import { Box, Container, Typography } from "@mui/material"
import { flightRecommendations } from "@/data/flightRecommendations"
import styles from "./flight-recommendations.module.css"

export function FlightRecommendations() {
  return (
    <Container maxWidth="xl" className={styles.container}>
      <Box className={styles.section}>
        <Typography variant="h5" className={styles.sectionTitle}>
          Vuelos baratos desde Buenos Aires
        </Typography>

        <Box className={styles.grid}>
          {flightRecommendations.map((recommendation) => (
            <Box
              key={recommendation.id}
              className={styles.gridItem}
            >
              <Box
                className={styles.recommendationCard}
                style={{
                  backgroundImage: `url(${recommendation.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className={styles.cardOverlay}></div>
                <Box className={styles.cardContent}>
                  <Typography variant="h6" className={styles.destinationCity}>
                    {recommendation.destinationCity}
                  </Typography>
                  <Typography variant="body2" className={styles.destinationCountry}>
                    {recommendation.destinationCountry}
                  </Typography>

                  <Box className={styles.cardFooter}>
                    <Typography variant="body2" className={styles.suggestedDate}>
                      {recommendation.suggestedDate}
                    </Typography>
                    <Typography variant="h6" className={styles.price}>
                      ${recommendation.price}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  )
}
