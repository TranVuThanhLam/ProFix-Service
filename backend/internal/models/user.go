package models

import (
	"profix-service/internal/db" // hoặc path đúng đến package db của bạn
)

type User struct {
	Id        int64  `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	Phone     string `json:"phone"`
	Role      string `json:"role"`
	Status    string `json:"status"`
	Image_url string `json:"image_url"`
}

func (u *User) Create() (int64, error) {
	query := `INSERT INTO users (name, email, password, phone, role, status, image_url)
			  VALUES (?, ?, ?, ?, ?, ?, ?)`

	result, err := db.DB.Exec(query, u.Name, u.Email, u.Password, u.Phone, u.Role, u.Status, u.Image_url)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

func GetAllUsers() ([]User, error) {
	query := `SELECT id, name, email, password, phone, role, status, image_url FROM users`

	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var u User
		if err := rows.Scan(&u.Id, &u.Name, &u.Email, &u.Password, &u.Phone, &u.Role, &u.Status, &u.Image_url); err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	return users, nil
}

func GetUserByID(id int64) (*User, error) {
	query := `SELECT id, name, email, password, phone, role, status, image_url FROM users WHERE id = ?`

	var u User
	err := db.DB.QueryRow(query, id).Scan(&u.Id, &u.Name, &u.Email, &u.Password, &u.Phone, &u.Role, &u.Status, &u.Image_url)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			return nil, nil
		}
		return nil, err
	}
	return &u, nil
}

func (u *User) Update() error {
	query := `UPDATE users SET name = ?, email = ?, password = ?, phone = ?, role = ?, status = ?, image_url = ? WHERE id = ?`
	_, err := db.DB.Exec(query, u.Name, u.Email, u.Password, u.Phone, u.Role, u.Status, u.Image_url, u.Id)
	return err
}

func DeleteUser(id int64) error {
	query := `DELETE FROM users WHERE id = ?`
	_, err := db.DB.Exec(query, id)
	return err
}
