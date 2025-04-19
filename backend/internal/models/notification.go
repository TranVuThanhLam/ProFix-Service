package models

import (
	"profix-service/internal/db"
)

type Notification struct {
	ID        int64  `json:"id"`
	UserId    int64  `json:"user_id"`
	Content   string `json:"content"`
	IsRead    string `json:"is_read"`
	CreatedAt string `json:"created_at"`
}

func (n *Notification) Create() (int64, error) {
	query := `INSERT INTO notifications (user_id, content, is_read, created_at)
			  VALUES (?, ?, ?, ?)`
	result, err := db.DB.Exec(query, n.UserId, n.Content, n.IsRead, n.CreatedAt)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

func GetAllNotifications() ([]Notification, error) {
	query := `SELECT id, user_id, content, is_read, created_at FROM notifications`
	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notifs []Notification
	for rows.Next() {
		var n Notification
		if err := rows.Scan(&n.ID, &n.UserId, &n.Content, &n.IsRead, &n.CreatedAt); err != nil {
			return nil, err
		}
		notifs = append(notifs, n)
	}
	return notifs, nil
}

func GetNotificationByID(id int64) (*Notification, error) {
	query := `SELECT id, user_id, content, is_read, created_at FROM notifications WHERE id = ?`
	var n Notification
	err := db.DB.QueryRow(query, id).Scan(&n.ID, &n.UserId, &n.Content, &n.IsRead, &n.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &n, nil
}

func (n *Notification) Update() error {
	query := `UPDATE notifications SET user_id = ?, content = ?, is_read = ?, created_at = ? WHERE id = ?`
	_, err := db.DB.Exec(query, n.UserId, n.Content, n.IsRead, n.CreatedAt, n.ID)
	return err
}

func DeleteNotification(id int64) error {
	query := `DELETE FROM notifications WHERE id = ?`
	_, err := db.DB.Exec(query, id)
	return err
}
