"use client"

import type React from "react"
import { useState, useEffect } from "react" // Agregamos useState y useEffect
import { Box, Container, Typography } from "@mui/material"
import { flightRecommendations } from "@/data/flightRecommendations"
import styles from "./flight-recommendations.module.css"

export function FlightRecommendations() {
  // 1. Creamos un estado para la ciudad, con un valor por defecto o un texto de carga sutil
  const [city, setCity] = useState("tu ubicación"); 

  // 2. Usamos useEffect para buscar la ubicación cuando el componente se monta
  useEffect(() => {
    // ipapi.co es gratuita y no requiere API key para uso moderado (hasta 1000 requests/día)
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data.city) {
          setCity(data.city); // Ej: "Buenos Aires", "Madrid", etc.
        }
      })
      .catch((err) => {
        console.error("Error al obtener la ubicación por IP:", err);
        // Si la API falla o hay bloqueadores de anuncios, seteamos un default seguro
        setCity("Buenos Aires"); 
      });
  }, []);

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Box className={styles.section}>
        <Box className={styles.headerSection}>
          <Typography component="span" className={styles.breadcrumb}>
            Vuelos
          </Typography>
          {/* 3. Reemplazamos el texto estático por nuestra variable */}
          <Typography component="h2" className={styles.sectionTitle}>
            Vuelos económicos desde {city}
          </Typography>
        </Box>

        <Typography component="h3" className={styles.subsectionTitle}>
          Viajes populares desde {city}
        </Typography>

        <Box className={styles.grid}>
          {flightRecommendations.map((recommendation) => (
            <Box key={recommendation.id} className={styles.gridItem}>
              <Box
                className={styles.recommendationCard}
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.8) 100%), url(${recommendation.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <Box className={styles.cardContent}>
                  <Box className={styles.priceTag}>
                    <Typography component="div" className={styles.price}>
                      ARS ${recommendation.price.toLocaleString("es-AR")}
                    </Typography>
                  </Box>

                  <Box className={styles.cardFooter}>
                    <Typography component="h4" className={styles.destinationCity}>
                      {recommendation.destinationCity}
                    </Typography>
                    <Typography component="p" className={styles.flightInfo}>
                      {recommendation.suggestedDate}
                    </Typography>
                    <Typography component="p" className={styles.flightDetails}>
                      {recommendation.stops === 0 ? "Vuelo directo" : `${recommendation.stops} escala`} · {recommendation.duration} · {recommendation.airline}
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