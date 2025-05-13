package services

import (
	"profix-service/internal/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

type UpdateBookingInput struct {
	Status      *string `json:"status"`
	BookingTime *string `json:"booking_time"`
	TotalPrice  *int    `json:"total_price"`
}


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

func UpdateBooking(context *gin.Context) {
	bookingID, err := strconv.ParseInt(context.Param("id"), 10, 64)
	if err != nil {
		context.JSON(400, gin.H{"error": "Invalid booking ID"})
		return
	}

	var input UpdateBookingInput
	if err := context.ShouldBindJSON(&input); err != nil {
		context.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	booking, err := models.GetBookingByID(bookingID)
	if err != nil {
		context.JSON(500, gin.H{"error": "Database error"})
		return
	}
	if booking == nil {
		context.JSON(404, gin.H{"error": "Booking not found"})
		return
	}

	updates := make(map[string]interface{})
	if input.Status != nil {
		updates["status"] = *input.Status
	}
	if input.BookingTime != nil {
		updates["booking_time"] = *input.BookingTime
	}
	if input.TotalPrice != nil {
		updates["total_price"] = *input.TotalPrice
	}

	if err := booking.UpdateFields(updates); err != nil {
		context.JSON(500, gin.H{"error": err.Error()})
		return
	}

	context.JSON(200, gin.H{"message": "Booking updated successfully"})
}
