package main

import "github.com/gin-gonic/gin"

func main() {
	server := gin.Default()

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

	server.GET("/api", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "hi api",
		})
	})
	server.GET("/api2", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "hi api 2",
		})
	})

	// Start the server on port 8080
	server.Run(":8080")
}
