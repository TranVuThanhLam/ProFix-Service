package services

import (
	"fmt"
	"net/http"
	"profix-service/internal/models"

	"github.com/gin-gonic/gin"
)

func AddService(context *gin.Context) {
	// Logic to add a service
	var service models.Service
	err := context.ShouldBindBodyWithJSON(&service)
	fmt.Println(service)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Can't read your input information"})
		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	_, err = service.Create()
	if err != nil {
		// context.JSON(http.StatusInternalServerError, gin.H{"message": "Can't add service"})
		context.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})

		return
	}

	context.JSON(200, gin.H{"message": "Service added successfully", "service" : service})
}