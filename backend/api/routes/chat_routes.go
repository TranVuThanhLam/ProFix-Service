package routes

import (
	"profix-service/internal/services"

	"github.com/gin-gonic/gin"
)

func RegisterChatRoutes(r *gin.Engine) {
	chat := r.Group("/api/chat")
	{
		chat.GET("/people", services.GetChatPeople)
	}
}
