package models

import (
	"errors"
	"profix-service/internal/db" // hoặc path đúng đến package db của bạn
	"profix-service/internal/utils"
)

type User struct {
	Id        int64  `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	Phone     string `json:"phone"`
	Role      string `json:"role"`
	Status    string `json:"status"`
	ImageUrl string `json:"image_url"`
}

func (u *User) Create() (int64, error) {
	query := `INSERT INTO users (name, email, password, phone, role, status, image_url)
			  VALUES (?, ?, ?, ?, ?, ?, ?)`
	result, err := db.DB.Exec(query, u.Name, u.Email, u.Password, u.Phone, u.Role, "active", u.ImageUrl)
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
		if err := rows.Scan(&u.Id, &u.Name, &u.Email, &u.Password, &u.Phone, &u.Role, &u.Status, &u.ImageUrl); err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	return users, nil
}

func GetUserByID(id int64) (User, error) {
	query := `SELECT id, name, email, password, phone, role, status, image_url FROM users WHERE id = ?`

	var user User
	err := db.DB.QueryRow(query, id).Scan(&user.Id, &user.Name, &user.Email, &user.Password, &user.Phone, &user.Role, &user.Status, &user.ImageUrl)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			return user, errors.New("User not found")
		}
		return user, errors.New("Error retrieving user: " + err.Error())
	}
	return user, nil
}

func (u *User) Update() error {
	query := `UPDATE users SET name = ?, email = ?, password = ?, phone = ?, role = ?, status = ?, image_url = ? WHERE id = ?`
	_, err := db.DB.Exec(query, u.Name, u.Email, u.Password, u.Phone, u.Role, u.Status, u.ImageUrl, u.Id)
	return err
}

func DeleteUser(id int64) error {
	query := `DELETE FROM users WHERE id = ?`
	_, err := db.DB.Exec(query, id)
	return err
}
// ===================================================================================

func (user *User) VerifyUser() error {
	retrievedPassword, err := CheckUser(user)
	if err!= nil {
		return err
	}

	ok := utils.PasswordVerify(user.Password, retrievedPassword)
	if !ok {
		return errors.New("invalid Password")
	}

	return nil
}

func CheckUser(user *User) (string, error) {
	Query := `
	SELECT id, password, status FROM users
	WHERE email = ?
	`
	rowUser := db.DB.QueryRow(Query, user.Email)

	var retrievedPassword string
	// var err error
	err := rowUser.Scan(&user.Id, &retrievedPassword, &user.Status)
	if err == nil && user.Status == "active" {
		return retrievedPassword, nil
	} else if err == nil && user.Status == "inactive" {
		return "", errors.New("this User is locked or ban by admin. Check your email or contact us")
	} else if err != nil {
		if err.Error() == "sql: no rows in result set" {
			return "", errors.New("email does not exist") // Email không tồn tại
		}
	}
	return "", err
}



