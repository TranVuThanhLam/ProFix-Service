package routes

import (
	"net/http"
	"pro-fix-service/internal/db"

	"github.com/gin-gonic/gin"
	"github.com/go-sql-driver/mysql"
)

func Routes(server *gin.Engine) {
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

	server.GET("/api", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "hi api",
		})
	})
	server.GET("/api2", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "hi api 2",
		})
	})

	server.POST("user", addUser)
	server.GET("user", getAllUsers)
}

type User struct {
	ID       int    `json:"id"`
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
	Phone    string `json:"phone"`
	Role     string `json:"role" binding:"required,oneof=user provider admin"`
	Status   string `json:"status"` // mặc định active nếu không truyền
	ImageURL string `json:"image_url"`
}

func addUser(c *gin.Context) {
	var newUser User

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
	_, err := db.DB.Exec(query, newUser.Name, newUser.Email, newUser.Password, newUser.Phone, newUser.Role, newUser.Status, newUser.ImageURL)
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

	var users []User

	for rows.Next() {
		var user User
		err := rows.Scan(
			&user.ID,
			&user.Name,
			&user.Email,
			&user.Phone,
			&user.Role,
			&user.Status,
			&user.ImageURL,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning user data"})
			return
		}
		users = append(users, user)
	}

	c.JSON(http.StatusOK, gin.H{"users": users})
}
