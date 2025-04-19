package models

import (
	"errors"
	"fmt"
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
	Image_url string `json:"image_url"`
}

func (u *User) Create() (int64, error) {
	query := `INSERT INTO users (name, email, password, phone, role, status, image_url)
			  VALUES (?, ?, ?, ?, ?, ?, ?)`
	fmt.Println("role", u.Role);
	result, err := db.DB.Exec(query, u.Name, u.Email, u.Password, u.Phone, u.Role, "active", u.Image_url)
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
// ===================================================================================

func (u *User) Login() error {
	retrievedPassword, ok := CheckUser(u)
	if ok {
		return errors.New("email does not exist")
	}
	if u.Status == "inactive" {
		return errors.New("this User is locked or ban by admin. Check your email or contact us")
	}
	ok = utils.PasswordVerify(u.Password, retrievedPassword)
	if !ok {
		return errors.New("invalid Password")
	}
	return nil
}

func CheckUser(user *User) (string, bool) {
	Query := `
	SELECT id, password, status FROM users
	WHERE gmail = ?
	`
	rowUser := db.DB.QueryRow(Query, user.Email)

	var retrievedPassword string
	var err error
	err = rowUser.Scan(&user.Id, &retrievedPassword)
	if err == nil {
		user.Role = "admin"
		return retrievedPassword, false
	} else {
		err = rowStaff.Scan(&user.Id, &retrievedPassword, &user.Status)
		if err == nil {
			user.Role = "staff"
			return retrievedPassword, false
		} else {
			err = rowOwner.Scan(&user.Id, &retrievedPassword, &user.Status)
			if err == nil {
				user.Role = "owner"
				return retrievedPassword, false
			} else {
				err = rowCustomer.Scan(&user.Id, &retrievedPassword, &user.Status)
				if err == nil {
					user.Role = "customer"
					return retrievedPassword, false
				} else {
					fmt.Printf("Don't have any User like this")
					return "", true
				}
			}
		}
	}
}

