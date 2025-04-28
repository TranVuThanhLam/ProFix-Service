package services

import (
	"database/sql"
	"net/http"
	"profix-service/internal/db"

	"github.com/gin-gonic/gin"
)

type ChatPerson struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	Role string `json:"role"`
}

func GetChatPeople(c *gin.Context) {
	// role := c.Query("role")
	_ = c.Query("user_id")

	// idStr := c.Query("user_id")
	// userID, err := strconv.Atoi(idStr)
	// if err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid role or user_id"})
	// 	return
	// }

	var results []ChatPerson
	var rows *sql.Rows

	
	query := `
	SELECT DISTINCT id, name, role FROM users
	`
	
	rows, err := db.DB.Query(query)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch people"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var p ChatPerson
		if err := rows.Scan(&p.ID, &p.Name, &p.Role); err != nil {
			continue
		}
		results = append(results, p)
	}

	c.JSON(http.StatusOK, results)
}
