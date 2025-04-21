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
	"net/http"
	"profix-service/internal/db"
	"profix-service/internal/models"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-sql-driver/mysql"
)

func Routes(server *gin.Engine) {
	AuthRoutes(server)
	server.DELETE("/user/:id", deleteUser)

	// Define your routes here
	server.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	// Health check endpoint
	server.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "healthy",
		})
	})

	server.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "hi",
		})
	})

	server.POST("user", addUser)
	server.GET("user", getAllUsers)
}

func deleteUser(context *gin.Context) {
	id := context.Param("id")
    idInt64, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}
	models.DeleteUser(idInt64)
	context.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

func addUser(c *gin.Context) {
	var newUser models.User

	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// nếu status không có thì gán mặc định
	if newUser.Status == "" {
		newUser.Status = "active"
	}

	query := `
		INSERT INTO users (name, email, password, phone, role, status, image_url)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`
	_, err := db.DB.Exec(query, newUser.Name, newUser.Email, newUser.Password, newUser.Phone, newUser.Role, newUser.Status, newUser.ImageUrl)
	if err != nil {
		// kiểm tra lỗi duplicate email
		if mysqlErr, ok := err.(*mysql.MySQLError); ok && mysqlErr.Number == 1062 {
			c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
}




func getAllUsers(c *gin.Context) {
	rows, err := db.DB.Query(`SELECT id, name, email, phone, role, status, image_url FROM users`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}
	defer rows.Close()

	var users []models.User

	for rows.Next() {
		var user models.User
		err := rows.Scan(
			&user.Id,
			&user.Name,
			&user.Email,
			&user.Phone,
			&user.Role,
			&user.Status,
			&user.ImageUrl,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning user data"})
			return
		}
		users = append(users, user)
	}

	c.JSON(http.StatusOK, gin.H{"users": users})
}
