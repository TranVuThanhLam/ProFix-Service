package main

import (
	"pro-fix-service/api/routes"
	"pro-fix-service/internal/db"

	"github.com/gin-gonic/gin"
)

func main() {
	server := gin.Default()

	// Initialize the database connection
	db.InitDB()
	routes.Routes(server)

	// Start the server on port 8080
	server.Run(":8080")
}
