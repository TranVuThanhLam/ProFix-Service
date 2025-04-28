package middlewares

import (
	"fmt"
	"net/http"
	"profix-service/internal/utils"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(context *gin.Context) {
		token, err := context.Cookie("token")
		fmt.Println("token: ", token)
		if err != nil {
			// context.JSON(http.StatusUnauthorized, gin.H{"error": "Can not get token from cookie"})
			context.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			context.Abort()
			return
		}
		claims, err := utils.ParseJWT(token)
		if err != nil {
			context.JSON(http.StatusUnauthorized, gin.H{"error": "Claim failse"})
			context.Abort()
			return
		}

		fmt.Println("role: ", claims.Role)

		// Lưu userID và role vào context để sử dụng trong handler
		context.Set("userID", claims.UserID)
		context.Set("role", claims.Role)

		context.Next()
	}
}

func AdminOnly(c *gin.Context) {
	role, exists := c.Get("role")
	if !exists {
		c.JSON(http.StatusForbidden, gin.H{"error": "No role found"})
		c.Abort()
		return
	}

	roleStr, ok := role.(string) // Ép kiểu về string
	if !ok || roleStr != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Admin Access denied"})
		c.Abort()
		return
	}

	c.Next() // Tiếp tục request nếu là admin
}

func OwnerOnly(c *gin.Context) {
	role, exists := c.Get("role")
	if !exists {
		c.JSON(http.StatusForbidden, gin.H{"error": "No role found"})
		c.Abort()
		return
	}

	roleStr, ok := role.(string)
	if !ok || roleStr != "owner" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Owner Access denied"})
		c.Abort()
		return
	}

	c.Next() // Tiếp tục request nếu là owner
}
