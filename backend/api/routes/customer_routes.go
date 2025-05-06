package routes

import (
	"profix-service/internal/services"

	"github.com/gin-gonic/gin"
)

func CustomerRoutes(r *gin.RouterGroup) {
	customer := r.Group("/customer")
	{
		customer.GET("/bookings", services.GetAllBookingsByUserId)
	// 	customer.GET("/users", services.GetAllUsers)
	// 	customer.GET("/users/:id", services.GetUserByID)
	// 	customer.POST("/users", services.CreateUser)
	// 	customer.PUT("/users/:id", services.UpdateUser)
	// 	customer.DELETE("/users/:id", services.DeleteUser)
	}
}