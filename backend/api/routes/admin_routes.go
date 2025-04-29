package routes

import (
	"profix-service/internal/services"

	"github.com/gin-gonic/gin"
)

func AdminRoutes(r *gin.RouterGroup) {
	admin := r.Group("/admin")
	{
		admin.DELETE("/user/:id", services.DeleteUser)
		admin.GET("user", services.GetAllUsers)
		admin.POST("user", services.AddUser)
		// admin.GET("/users/:id", services.GetUserByID)
		// admin.PUT("/users/:id", services.UpdateUser)
		// admin.DELETE("/users/:id", services.DeleteUser)
	}
}