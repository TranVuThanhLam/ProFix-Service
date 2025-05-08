package services

import (
	"profix-service/internal/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateBooking(context *gin.Context) {
	var booking models.Booking

	context.ShouldBindBodyWithJSON(&booking)
	_, err := booking.Create()
	if err != nil {
		context.JSON(500, gin.H{"error": err.Error()})
		return
	}


	context.JSON(200, gin.H{"message": "Booking created successfully"})
}

func GetAllBookingsByCustomerId(context *gin.Context) {
	customerId, err := strconv.ParseInt(context.Param("customer_id"), 10, 64)
	if err != nil {
		context.JSON(400, gin.H{"error": "Invalid customer ID"})
		return
	}
	bookings, err := models.GetAllBookingsByCustomerId(customerId)
	if err != nil {
		context.JSON(500, gin.H{"error": err.Error()})
		return
	}
	context.JSON(200, bookings)
	
}

func GetAllBookingsByProviderId(context *gin.Context) {
	providerID, err := strconv.ParseInt(context.Param("provider_id"), 10, 64)
	if err != nil {
		context.JSON(400, gin.H{"error": "Invalid provider ID"})
		return
	}
	bookings, err := models.GetAllBookingsByProviderId(providerID)
	if err != nil {
		context.JSON(500, gin.H{"error": err.Error()})
		return
	}
	context.JSON(200, bookings)
	
}