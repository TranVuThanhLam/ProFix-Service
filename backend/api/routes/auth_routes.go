package routes

import (
	"profix-service/internal/middlewares"
	"profix-service/internal/services"

	"github.com/gin-gonic/gin"
	// "github.com/restaurent_table_booking/internal/middlewares"
	// "github.com/restaurent_table_booking/internal/services"
)

// AuthRoutes định nghĩa các route xác thực và quản lý người dùng.
func AuthRoutes(server *gin.Engine) {
	server.POST("/register", services.Register)
	server.POST("/login", services.Login)
	server.GET("/me", middlewares.AuthMiddleware(), services.GetUserProfile)
	// server.POST("/me", middlewares.AuthMiddleware(), services.UpdateProfile)
	server.POST("/logout", services.Logout)


	// server.POST("/forgot-password", services.ForgotPassword)
	// server.POST("/verify-pin", services.CheckPin)
	// server.POST("/resend-pin", services.ResendPin)
	// server.POST("/reset-password", services.ResetPassword)
	// server.POST("/change-password", middlewares.AuthMiddleware(), services.ChangePassword)
}
