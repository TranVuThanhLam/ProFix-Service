package main

import (
	"profix-service/api/routes"
	"profix-service/internal/db"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	server := gin.Default()

	// Initialize the database connection
	db.InitDB()


	server.Use(cors.New(cors.Config{
		// Chỉ cho phép frontend truy cập
		// AllowOrigins:     []string{"http://localhost:3000", "https://desktop-b0d0j2q.tail04954f.ts.net/"},
		AllowAllOrigins:  true,	
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true, // Cho phép gửi cookie qua CORS
	}))

	
	routes.Routes(server)

	// Start the server on port 8080
	server.Run(":8080")
}
