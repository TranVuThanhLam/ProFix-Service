package routes

// restaurant := server.Group("/restaurant")
// {
// 	restaurant.GET("/:restaurant_id", services.GetRestaurantByID)
// 	restaurant.GET("/:restaurant_id/tables", services.GetAllTables)
// }
// server.GET("/table/:table_id", services.GetTableByID)

// // Các route xác thực
// AuthRoutes(server)

// Guest(server)

// // Các route người dùng với quyền riêng
// User := server.Group("/")
// User.Use(middlewares.AuthMiddleware())
// {
// 	AdminRoutes(User)
// 	OwnerRoutes(User)
// 	CustomerRoutes(User)
// 	// StaffRoutes(User)
// }

import (
	"profix-service/internal/middlewares"

	"github.com/gin-gonic/gin"
)

func Routes(server *gin.Engine) {
	AuthRoutes(server)
	RegisterChatRoutes(server)
	QuestRoute(server)

	

	// // Các route người dùng với quyền riêng
	User := server.Group("/")
	User.Use(middlewares.AuthMiddleware())
	{
		AdminRoutes(User)
		ProviderRoutes(User)
		CustomerRoutes(User)
		// StaffRoutes(User)
	}


}



