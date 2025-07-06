package controllers

import (
	"monetizeai-backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ChatRequest struct {
	Username string `json:"username"`
	Message  string `json:"message"`
}

func GetChatMessages(c *gin.Context, db *gorm.DB) {
	var realMsgs []models.ChatMessage
	db.Order("timestamp desc").Limit(30).Find(&realMsgs)
	c.JSON(http.StatusOK, gin.H{"messages": realMsgs})
}

func PostChatMessage(c *gin.Context, db *gorm.DB) {
	var req ChatRequest
	if err := c.ShouldBindJSON(&req); err != nil || req.Message == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}
	if req.Username == "" {
		req.Username = "you"
	}
	msg := models.ChatMessage{
		Username:  req.Username,
		Message:   req.Message,
		Timestamp: time.Now(),
		IsAdmin:   false,
	}
	if err := db.Create(&msg).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save message"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": msg})
}
