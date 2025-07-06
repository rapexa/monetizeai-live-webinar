package routes

import (
	"monetizeai-backend/controllers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB) {
	// Create video controller with videos directory
	videoController := controllers.NewVideoController("./videos")

	api := r.Group("/api")
	{
		api.POST("/register", func(c *gin.Context) { controllers.RegisterUser(c, db) })
		api.GET("/webinar", func(c *gin.Context) { controllers.GetWebinarInfo(c, db) })
		api.GET("/chat", func(c *gin.Context) { controllers.GetChatMessages(c, db) })
		api.POST("/chat", func(c *gin.Context) { controllers.PostChatMessage(c, db) })
	}

	// Video streaming routes
	video := r.Group("/video")
	{
		video.GET("/:video", videoController.StreamLiveVideo) // Live streaming (no seeking)
		video.GET("/", videoController.StreamLiveVideo)       // Default video
	}

	// Regular video routes (with seeking support) - for non-live content
	regularVideo := r.Group("/video-regular")
	{
		regularVideo.GET("/:video", videoController.StreamVideo)
		regularVideo.GET("/", videoController.StreamVideo)
	}
}
