package controllers

import (
	"monetizeai-backend/models"
	"monetizeai-backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Webinar controller logic will go here

func GetWebinarInfo(c *gin.Context, db *gorm.DB) {
	var webinar models.Webinar
	if err := db.First(&webinar).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Webinar not found"})
		return
	}

	videoURL := "/video/video1.mp4"
	if !utils.IsBefore6PM() {
		videoURL = "/video/video2.mp4"
	}

	c.JSON(http.StatusOK, gin.H{
		"title":            webinar.Title,
		"start_time":       webinar.StartTime,
		"end_time":         webinar.EndTime,
		"video_url":        videoURL,
		"capacity":         webinar.Capacity,
		"registered_count": webinar.RegisteredCount,
		"is_live":          webinar.IsLive,
	})
}
