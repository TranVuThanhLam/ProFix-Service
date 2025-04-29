package routes

import (
	"profix-service/internal/services"

	"github.com/gin-gonic/gin"
)

func QuestRoute(server *gin.Engine) {

	server.GET("/services", services.GetAllServices)
	server.GET("/service/:id", services.GetServiceByID)

	// ============== routes to test ===================

	// Define your routes here
	server.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	// Health check endpoint
	server.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "healthy",
		})
	})

	server.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "hi",
		})
	})
}