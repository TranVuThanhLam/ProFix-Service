package services

import (
	"fmt"
	"net/http"
	"profix-service/internal/db"
	"profix-service/internal/models"
	"strconv"
	"time"

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

func GetAllServicesByProviderId(context *gin.Context) {
	providerID, err := strconv.ParseInt(context.Param("provider_id"), 10, 64)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Invalid provider ID"})
		return
	}
	services, err := models.GetAllServicesByProviderId(providerID)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	context.JSON(200, services)
}

// ===============================================
func GetProviderStats(c *gin.Context) {
	providerID := c.Param("provider_id")
	var totalServices int
	err := db.DB.QueryRow(`
		SELECT COUNT(*) FROM services
		WHERE provider_id = ?`, providerID).Scan(&totalServices)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi lấy số lượng dịch vụ"})
		return
	}

	var todayBookings int
	today := time.Now().Format("2006-01-02")
	err = db.DB.QueryRow(`
		SELECT COUNT(*) FROM bookings b
		JOIN services s ON b.service_id = s.id
		WHERE s.provider_id = ? AND DATE(b.booking_time) = ?`,
		providerID, today).Scan(&todayBookings)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi lấy số đơn hôm nay"})
		return
	}

	var processingBookings int
	err = db.DB.QueryRow(`
		SELECT COUNT(*) FROM bookings b
		JOIN services s ON b.service_id = s.id
		WHERE s.provider_id = ? AND b.status NOT IN ('cancelled', 'completed')`,
		providerID).Scan(&processingBookings)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi lấy đơn đang xử lý"})
		return
	}

	var revenue int
	err = db.DB.QueryRow(`
		SELECT IFNULL(SUM(b.total_price), 0) FROM bookings b
		JOIN services s ON b.service_id = s.id
		WHERE s.provider_id = ? AND b.status = 'confirmed'`,
		providerID).Scan(&revenue)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi tính doanh thu"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"services":           totalServices,
		"todayBookings":      todayBookings,
		"processingBookings": processingBookings,
		"revenue":            revenue,
	})
}