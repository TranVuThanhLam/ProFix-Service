package services

import (
	"net/http"
	"profix-service/internal/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetAllServices(c *gin.Context) {
	// Fetch all services from the database
	services, err := models.GetAllServices()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return the list of services as JSON
	c.JSON(http.StatusOK, services)
}

func GetServiceByID(c *gin.Context) {
	id, err :=  strconv.ParseInt((c.Param("id")),10,64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid service ID"})
		return
	}

	// Fetch the service by ID from the database
	service, err := models.GetServiceByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return the service as JSON
	c.JSON(http.StatusOK, service)
}