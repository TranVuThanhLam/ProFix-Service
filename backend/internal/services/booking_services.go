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

func GetAllBookingsByUserId(context *gin.Context) {
	customerID, err := strconv.ParseInt(context.Param("customer_id"), 10, 64)
	if err != nil {
		context.JSON(400, gin.H{"error": "Invalid customer ID"})
		return
	}
	bookings, err := models.GetAllBookingsByUserId(customerID)
	if err != nil {
		context.JSON(500, gin.H{"error": err.Error()})
		return
	}
	context.JSON(200, bookings)
	
}