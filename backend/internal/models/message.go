package models

import (
	"profix-service/internal/db"
)

type Message struct {
	ID         int64  `json:"id"`
	SenderId   int64  `json:"sender_id"`
	ReceiverId int64  `json:"receiver_id"`
	Content    string `json:"content"`
	SentAt     string `json:"sent_at"`
}

func (m *Message) Create() (int64, error) {
	query := `INSERT INTO messages (sender_id, receiver_id, content, sent_at)
			  VALUES (?, ?, ?, ?)`
	result, err := db.DB.Exec(query, m.SenderId, m.ReceiverId, m.Content, m.SentAt)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

func GetAllMessages() ([]Message, error) {
	query := `SELECT id, sender_id, receiver_id, content, sent_at FROM messages`
	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []Message
	for rows.Next() {
		var m Message
		if err := rows.Scan(&m.ID, &m.SenderId, &m.ReceiverId, &m.Content, &m.SentAt); err != nil {
			return nil, err
		}
		messages = append(messages, m)
	}
	return messages, nil
}

func GetMessageByID(id int64) (*Message, error) {
	query := `SELECT id, sender_id, receiver_id, content, sent_at FROM messages WHERE id = ?`
	var m Message
	err := db.DB.QueryRow(query, id).Scan(&m.ID, &m.SenderId, &m.ReceiverId, &m.Content, &m.SentAt)
	if err != nil {
		return nil, err
	}
	return &m, nil
}

func (m *Message) Update() error {
	query := `UPDATE messages SET sender_id = ?, receiver_id = ?, content = ?, sent_at = ? WHERE id = ?`
	_, err := db.DB.Exec(query, m.SenderId, m.ReceiverId, m.Content, m.SentAt, m.ID)
	return err
}

func DeleteMessage(id int64) error {
	query := `DELETE FROM messages WHERE id = ?`
	_, err := db.DB.Exec(query, id)
	return err
}
