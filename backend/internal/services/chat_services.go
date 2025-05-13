package services

import (
	"database/sql"
	"net/http"
	"profix-service/internal/db"
	"strconv"

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

// Lấy tin nhắn giữa 2 người dùng
func GetMessages(context *gin.Context) {
	senderID := context.DefaultQuery("sender_id", "")
	receiverID := context.DefaultQuery("receiver_id", "")

	// Chuyển các tham số ID về kiểu int
	senderIDInt, err := strconv.Atoi(senderID)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid sender ID"})
		return
	}
	receiverIDInt, err := strconv.Atoi(receiverID)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid receiver ID"})
		return
	}

	// Truy vấn để lấy tin nhắn
	rows, err := db.DB.Query(`
		SELECT sender_id, receiver_id, content, sent_at
		FROM messages
		WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
		ORDER BY sent_at ASC
	`, senderIDInt, receiverIDInt, receiverIDInt, senderIDInt)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var messages []map[string]interface{}
	for rows.Next() {
		var senderID, receiverID int
		var content, sentAt string
		if err := rows.Scan(&senderID, &receiverID, &content, &sentAt); err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		messages = append(messages, map[string]interface{}{
			"sender_id":   senderID,
			"receiver_id": receiverID,
			"content":     content,
			"sent_at":     sentAt,
		})
	}

	context.JSON(http.StatusOK, messages)
}
