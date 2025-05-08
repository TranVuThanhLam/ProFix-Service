package routes

import (
	"profix-service/internal/services"

	"github.com/gin-gonic/gin"
)

func ProviderRoutes(r *gin.RouterGroup) {
	provider := r.Group("/provider")
	{
		provider.POST("/service", services.AddService)
		provider.GET("/bookings/:provider_id", services.GetAllBookingsByProviderId)
		provider.GET("/services/:provider_id", services.GetAllServicesByProviderId)
		
		// provider.PUT("/users/:id", services.UpdateUser)
		// provider.DELETE("/users/:id", services.DeleteUser)
	}
}