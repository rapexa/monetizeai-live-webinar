package controllers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// VideoController handles video streaming
type VideoController struct {
	VideoPath string
}

// NewVideoController creates a new video controller
func NewVideoController(videoPath string) *VideoController {
	return &VideoController{
		VideoPath: videoPath,
	}
}

// StreamLiveVideo handles live video streaming (no seeking allowed)
func (vc *VideoController) StreamLiveVideo(c *gin.Context) {
	videoName := c.Param("video")
	if videoName == "" {
		videoName = "video1.mp4" // default video
	}

	// Security: prevent directory traversal
	if strings.Contains(videoName, "..") || strings.Contains(videoName, "/") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid video name"})
		return
	}

	videoPath := filepath.Join(vc.VideoPath, videoName)

	// Check if file exists
	if _, err := os.Stat(videoPath); os.IsNotExist(err) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Video not found"})
		return
	}

	// Get file info
	fileInfo, err := os.Stat(videoPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get video info"})
		return
	}

	// For live streaming, we don't support range requests
	rangeHeader := c.GetHeader("Range")
	if rangeHeader != "" {
		// Return 200 OK with full video for live streaming
		c.Header("Accept-Ranges", "none") // Disable seeking
		c.Header("Content-Length", strconv.FormatInt(fileInfo.Size(), 10))
		c.Header("Content-Type", "video/mp4")
		c.Header("Cache-Control", "no-cache, no-store, must-revalidate")
		c.Header("Pragma", "no-cache")
		c.Header("Expires", "0")
		c.Header("X-Live-Stream", "true")

		// Stream the full video without seeking
		vc.streamLive(c, videoPath)
		return
	}

	// Full video request for live streaming
	c.Header("Accept-Ranges", "none") // Disable seeking
	c.Header("Content-Length", strconv.FormatInt(fileInfo.Size(), 10))
	c.Header("Content-Type", "video/mp4")
	c.Header("Cache-Control", "no-cache, no-store, must-revalidate")
	c.Header("Pragma", "no-cache")
	c.Header("Expires", "0")
	c.Header("X-Live-Stream", "true")

	// Stream the full video
	vc.streamLive(c, videoPath)
}

// streamLive streams the video as a live stream (no seeking)
func (vc *VideoController) streamLive(c *gin.Context, videoPath string) {
	file, err := os.Open(videoPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open video"})
		return
	}
	defer file.Close()

	// Set content type for live streaming
	c.Header("Content-Type", "video/mp4")

	// Create buffer for streaming
	buffer := make([]byte, 64*1024) // 64KB buffer for smoother streaming

	// Stream the file in chunks to simulate live streaming
	for {
		n, err := file.Read(buffer)
		if err != nil || n == 0 {
			break
		}

		// Check if client disconnected before writing
		if c.Writer.Status() == http.StatusOK {
			// Write chunk to response
			_, writeErr := c.Writer.Write(buffer[:n])
			if writeErr != nil {
				// Client disconnected, stop streaming
				break
			}

			// Flush the response to ensure data is sent immediately
			c.Writer.Flush()
		} else {
			// Response already sent, stop streaming
			break
		}

		// Small delay to simulate real-time streaming
		time.Sleep(10 * time.Millisecond)
	}
}

// StreamVideo handles video streaming with range support (for non-live content)
func (vc *VideoController) StreamVideo(c *gin.Context) {
	videoName := c.Param("video")
	if videoName == "" {
		videoName = "video1.mp4" // default video
	}

	// Security: prevent directory traversal
	if strings.Contains(videoName, "..") || strings.Contains(videoName, "/") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid video name"})
		return
	}

	videoPath := filepath.Join(vc.VideoPath, videoName)

	// Check if file exists
	if _, err := os.Stat(videoPath); os.IsNotExist(err) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Video not found"})
		return
	}

	// Get file info
	fileInfo, err := os.Stat(videoPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get video info"})
		return
	}

	// Get file size
	fileSize := fileInfo.Size()

	// Handle range requests for video streaming
	rangeHeader := c.GetHeader("Range")
	if rangeHeader != "" {
		// Parse range header
		rangeStr := strings.Replace(rangeHeader, "bytes=", "", 1)
		parts := strings.Split(rangeStr, "-")

		if len(parts) == 2 {
			start, err := strconv.ParseInt(parts[0], 10, 64)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid range"})
				return
			}

			var end int64
			if parts[1] != "" {
				end, err = strconv.ParseInt(parts[1], 10, 64)
				if err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid range"})
					return
				}
			} else {
				end = fileSize - 1
			}

			// Validate range
			if start >= fileSize || end >= fileSize || start > end {
				c.JSON(http.StatusRequestedRangeNotSatisfiable, gin.H{"error": "Invalid range"})
				return
			}

			// Set headers for partial content
			contentLength := end - start + 1
			c.Header("Content-Range", fmt.Sprintf("bytes %d-%d/%d", start, end, fileSize))
			c.Header("Accept-Ranges", "bytes")
			c.Header("Content-Length", strconv.FormatInt(contentLength, 10))
			c.Status(http.StatusPartialContent)

			// Stream the requested range
			vc.streamRange(c, videoPath, start, end)
			return
		}
	}

	// Full video request
	c.Header("Accept-Ranges", "bytes")
	c.Header("Content-Length", strconv.FormatInt(fileSize, 10))
	c.Header("Content-Type", "video/mp4")

	// Stream the full video
	vc.streamFull(c, videoPath)
}

// streamRange streams a specific range of the video
func (vc *VideoController) streamRange(c *gin.Context, videoPath string, start, end int64) {
	file, err := os.Open(videoPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open video"})
		return
	}
	defer file.Close()

	// Seek to start position
	_, err = file.Seek(start, 0)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to seek video"})
		return
	}

	// Create buffer for streaming
	buffer := make([]byte, 32*1024) // 32KB buffer
	remaining := end - start + 1

	for remaining > 0 {
		readSize := int64(len(buffer))
		if remaining < readSize {
			readSize = remaining
		}

		n, err := file.Read(buffer[:readSize])
		if err != nil {
			break
		}

		if n > 0 {
			c.Data(http.StatusPartialContent, "video/mp4", buffer[:n])
			remaining -= int64(n)
		}
	}
}

// streamFull streams the entire video
func (vc *VideoController) streamFull(c *gin.Context, videoPath string) {
	file, err := os.Open(videoPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open video"})
		return
	}
	defer file.Close()

	// Set content type
	c.Header("Content-Type", "video/mp4")

	// Stream the file
	c.File(videoPath)
}
