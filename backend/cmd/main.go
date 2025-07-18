package main

import (
	"log"
	"monetizeai-backend/config"
	"monetizeai-backend/models"
	"monetizeai-backend/routes"
	"monetizeai-backend/utils"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	cfg := config.LoadConfig()

	// Ensure DB exists
	if err := utils.CreateDatabaseIfNotExists(cfg); err != nil {
		log.Fatalf("failed to create database: %v", err)
	}

	db, err := gorm.Open(mysql.Open(cfg.GetDSN()), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	// Auto-migrate models
	db.AutoMigrate(&models.User{}, &models.ChatMessage{}, &models.Webinar{})

	// Seed webinar if not present
	var count int64
	db.Model(&models.Webinar{}).Count(&count)
	if count == 0 {
		webinar := models.Webinar{
			Title:           "وبینار ساخت سیستم پولسازی دلاری با هوش مصنوعی",
			StartTime:       time.Now(),
			EndTime:         time.Now().Add(75 * time.Minute),
			VideoURL:        "video1.mp4",
			Capacity:        500,
			RegisteredCount: 0,
			IsLive:          true,
		}
		db.Create(&webinar)
	}

	r := gin.Default()

	// CORS configuration
	corsConfig := cors.Config{
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}

	// Set allowed origins based on configuration
	if len(cfg.AllowedOrigins) > 0 {
		corsConfig.AllowOrigins = cfg.AllowedOrigins
	} else {
		// Default fallback
		corsConfig.AllowOrigins = []string{"*"}
	}

	r.Use(cors.New(corsConfig))

	routes.SetupRoutes(r, db)

	log.Printf("Server running on port %s", cfg.ServerPort)

	// Start server with HTTPS if enabled
	if cfg.EnableHTTPS {
		log.Printf("Starting HTTPS server with SSL certificate")
		if err := r.RunTLS(":"+cfg.ServerPort, cfg.SSLCertFile, cfg.SSLKeyFile); err != nil {
			log.Fatalf("failed to start HTTPS server: %v", err)
		}
	} else {
		log.Printf("Starting HTTP server")
		if err := r.Run(":" + cfg.ServerPort); err != nil {
			log.Fatalf("failed to start HTTP server: %v", err)
		}
	}
}
