package routes

import (
	"profix-service/internal/services"

	"github.com/gin-gonic/gin"
)

func ProviderRoutes(r *gin.RouterGroup) {
	provider := r.Group("/provider")
	{
		provider.POST("/service", services.AddService)
		provider.GET("/bookings", services.GetAllBookingsByUserId)
		provider.GET("/services", services.GetAllServicesByProviderId)
		
		// provider.PUT("/users/:id", services.UpdateUser)
		// provider.DELETE("/users/:id", services.DeleteUser)
	}
}