package routes

import (
	"profix-service/internal/middlewares"

	"github.com/gin-gonic/gin"
)

func Routes(server *gin.Engine) {
	AuthRoutes(server)
	RegisterChatRoutes(server)
	QuestRoute(server)

	User := server.Group("/")
	User.Use(middlewares.AuthMiddleware())
	{
		UserRoutes(User)
		AdminRoutes(User)
		ProviderRoutes(User)
		CustomerRoutes(User)
	}
}



