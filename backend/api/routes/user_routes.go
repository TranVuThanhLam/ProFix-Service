package routes

import (
	"profix-service/internal/services"

	"github.com/gin-gonic/gin"
)

func UserRoutes(User *gin.RouterGroup) {
	User.POST("/booking", services.CreateBooking)
	// User.GET("/user/:user_id", services.GetUserByID)
	// User.GET("/user/:user_id/roles", services.GetUserRoles)
	// User.GET("/user/:user_id/permissions", services.GetUserPermissions)
	// User.POST("/user/:user_id/roles", services.AddUserRole)
	// User.POST("/user/:user_id/permissions", services.AddUserPermission)
	// User.DELETE("/user/:user_id/roles", services.RemoveUserRole)
	// User.DELETE("/user/:user_id/permissions", services.RemoveUserPermission)

}