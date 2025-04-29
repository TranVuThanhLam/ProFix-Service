package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"profix-service/internal/utils"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)
type Client struct {
	ID   int
	Conn *websocket.Conn
	Send chan []byte
}

var clients = make(map[string]*Client) 
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}


func chatHandler(c *gin.Context) {
	// Lấy token từ cookie
	token, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Sử dụng hàm ParseJWT để xác thực token
	claims, err := utils.ParseJWT(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	// Nếu token hợp lệ, lấy userID từ claims
	userID := int(claims.UserID)
	
	// Kết nối WebSocket
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("WebSocket upgrade failed:", err)
		return
	}

	clientKey := fmt.Sprintf("%d-%s", userID)
	client := &Client{
		ID:   userID,
		Conn: conn,
		Send: make(chan []byte),
	}

	clients[clientKey] = client
	go readMessages(client)
	go writeMessages(client)
}

func readMessages(client *Client) {
	defer func() {
		client.Conn.Close()
		delete(clients, fmt.Sprintf("%d-%s", client.ID))
	}()

	for {
		_, msg, err := client.Conn.ReadMessage()
		if err != nil {
			break
		}

		var payload struct {
			SenderID     int    `json:"sender_id"`
			ReceiverID   int    `json:"receiver_id"`
			Content      string `json:"content"`
		}

		if err := json.Unmarshal(msg, &payload); err != nil {
			continue
		}

		receiverKey := fmt.Sprintf("%d-%s", payload.ReceiverID)
		if receiver, ok := clients[receiverKey]; ok {
			receiver.Send <- msg
		}
	}
}

func writeMessages(client *Client) {
	for msg := range client.Send {
		if err := client.Conn.WriteMessage(websocket.TextMessage, msg); err != nil {
			break
		}
	}
}
