package utils

import (
	"database/sql"
	"fmt"
	"log"
	"monetizeai-backend/config"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

// Add utility functions here as needed

func IsBefore6PM() bool {
	now := time.Now()
	return now.Hour() < 18
}

// CreateDatabaseIfNotExists creates the MySQL database if it doesn't exist
func CreateDatabaseIfNotExists(cfg *config.Config) error {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/?parseTime=true&charset=utf8mb4&loc=Local", cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBPort)
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return err
	}
	defer db.Close()

	_, err = db.Exec("CREATE DATABASE IF NOT EXISTS " + cfg.DBName + " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
	if err != nil {
		return err
	}
	log.Printf("Database '%s' ensured.", cfg.DBName)
	return nil
}
