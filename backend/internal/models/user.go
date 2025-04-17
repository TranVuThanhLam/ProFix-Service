package models

import (
	"database/sql"
	"errors"
	"fmt"
	"profix-service/internal/db"
	"profix-service/internal/utils"
)

type User struct {
	Id        int64
	Name      string
	Email     string
	Phone     string
	Password  string
	Role      string
	Status    string
	Orther_id int64
}

type NewPassword struct {
	OldPassword string
	NewPassword string
}

func (u *User) RegisterCustomer() error {
	_, check := CheckUser(u)
	if !check {
		return errors.New("this gmail already create User before")
	}
	query := `INSERT INTO customers(name, gmail, phone, password, status) 
		VALUES (?,?,?,?,?)`
	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()
	hashPassword, err := utils.HashPassword(u.Password)
	if err != nil {
		return err
	}
	u.Status = "active"
	result, err := stmt.Exec(u.Name, u.Email, u.Phone, hashPassword, u.Status)
	if err != nil {
		return err
	}
	id, err := result.LastInsertId()
	if err != nil {
		return err
	}
	u.Id = id
	return nil
}

func (u *User) RegisterOwner() error {
	_, check := CheckUser(u)
	if !check {
		return errors.New("this gmail already create User before")
	}
	query := `INSERT INTO owners(name, gmail, phone, password, status) 
		VALUES (?,?,?,?,?)`
	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()
	hashPassword, err := utils.HashPassword(u.Password)
	if err != nil {
		return err
	}
	u.Status = "active"
	result, err := stmt.Exec(u.Name, u.Email, u.Phone, hashPassword, u.Status)
	if err != nil {
		return err
	}
	id, err := result.LastInsertId()
	if err != nil {
		return err

	}
	u.Id = id
	return nil
}

func (u *User) RegisterAdmin() error {
	_, check := CheckUser(u)
	if !check {
		return errors.New("this email is already associated with an existing User")
	}
	query := `INSERT INTO admin(name, gmail, phone, password) 
		VALUES (?,?,?,?)`
	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return errors.New("failed to prepare the SQL statement for registering admin: " + err.Error())
	}
	defer stmt.Close()

	hashPassword, err := utils.HashPassword(u.Password)
	if err != nil {
		return errors.New("failed to hash the password: " + err.Error())
	}
	result, err := stmt.Exec(u.Name, u.Email, u.Phone, hashPassword)
	if err != nil {
		return errors.New("failed to execute the SQL statement for registering admin: " + err.Error())
	}

	id, err := result.LastInsertId()
	if err != nil {
		return errors.New("failed to retrieve the last inserted ID for the new admin User: " + err.Error())
	}

	u.Id = id
	return nil
}

func (u *User) RegisterStaff() error {
	// Check if the User already exists
	fmt.Println(u.Orther_id)
	_, check := CheckUser(u)
	if !check {
		return errors.New("this email is already associated with an existing User")
	}

	// Prepare the SQL query
	query := `INSERT INTO staffs(gmail, name, phone, status, password, restaurant_id) 
        VALUES (?,?,?,?,?,?)`
	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return errors.New("failed to prepare the SQL statement for registering staff")
	}
	defer stmt.Close()

	// Hash the password
	hashPassword, err := utils.HashPassword(u.Password)
	if err != nil {
		return errors.New("failed to hash the password")
	}

	// Set the User status to active
	u.Status = "active"

	// Execute the SQL query
	result, err := stmt.Exec(u.Email, u.Name, u.Phone, u.Status, hashPassword, u.Orther_id)
	if err != nil {
		// return errors.New("failed to execute the SQL statement for registering staff")
		return errors.New(err.Error())
	}

	// Retrieve the last inserted ID
	id, err := result.LastInsertId()
	if err != nil {
		return errors.New("failed to retrieve the last inserted ID for the new staff User")
	}

	// Set the ID of the newly created User
	u.Id = id
	return nil
}
func (u *User) Login() error {
	retrievedPassword, ok := CheckUser(u)
	if ok {
		return errors.New("email does not exist")
	}

	if u.Status == "inactive" {
		return errors.New("this User is locked for security. Check your email and contact us")
	} else if u.Status == "ban" && u.Role == "staff" {
		return errors.New("User deleted. Contact the restaurant owner to restore")
	} else if u.Status == "ban" && u.Role == "owner" || u.Status == "ban" && u.Role == "customer" {
		return errors.New("this User is locked for violation. Check your email and contact us")
	}
	ok = utils.PasswordVerify(u.Password, retrievedPassword)
	if !ok {
		return errors.New("invalid Password")
	}
	return nil
}

func CheckUser(a *User) (string, bool) {
	CumtomersQuery := `
	SELECT id, password, status FROM customers
	WHERE gmail = ?
	`
	rowCustomer := db.DB.QueryRow(CumtomersQuery, a.Email)

	staffsQuery := `
	SELECT id, password, status FROM staffs
	WHERE gmail = ?
	`
	rowStaff := db.DB.QueryRow(staffsQuery, a.Email)

	adminsQuery := `
	SELECT id, password FROM admin
	WHERE gmail = ?
	`
	rowAdmin := db.DB.QueryRow(adminsQuery, a.Email)

	ownersQuery := `
	SELECT id, password, status FROM owners
	WHERE gmail = ?
	`
	rowOwner := db.DB.QueryRow(ownersQuery, a.Email)

	var retrievedPassword string
	var err error
	err = rowAdmin.Scan(&a.Id, &retrievedPassword)
	if err == nil {
		a.Role = "admin"
		return retrievedPassword, false
	} else {
		err = rowStaff.Scan(&a.Id, &retrievedPassword, &a.Status)
		if err == nil {
			a.Role = "staff"
			return retrievedPassword, false
		} else {
			err = rowOwner.Scan(&a.Id, &retrievedPassword, &a.Status)
			if err == nil {
				a.Role = "owner"
				return retrievedPassword, false
			} else {
				err = rowCustomer.Scan(&a.Id, &retrievedPassword, &a.Status)
				if err == nil {
					a.Role = "customer"
					return retrievedPassword, false
				} else {
					fmt.Printf("Don't have any User like this")
					return "", true
				}
			}
		}
	}
}

func (u *User) ResetPassword() error {
	query := `UPDATE customers SET password = ? WHERE gmail = ?`
	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return errors.New("failed to prepare the SQL statement for resetting password: " + err.Error())
	}
	defer stmt.Close()

	hashPassword, err := utils.HashPassword(u.Password)
	if err != nil {
		return errors.New("failed to hash the password: " + err.Error())
	}

	_, err = stmt.Exec(hashPassword, u.Email)
	if err != nil {
		return errors.New("failed to execute the SQL statement for resetting password: " + err.Error())
	}
	return nil
}

func GetAllUsers() ([]User, error) {
	sqlQuery := `
	SELECT id, gmail, name, phone, status, 'owner' FROM owners
	UNION
	SELECT id, gmail, name, phone, status, 'customer' FROM customers
	UNION
	SELECT id, gmail, name, phone, status, 'staffs' FROM staffs
	`
	rows, err := db.DB.Query(sqlQuery)
	if err != nil {
		return nil, errors.New("failed to execute the SQL query for retrieving all Users: " + err.Error())
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var u User
		err := rows.Scan(&u.Id, &u.Email, &u.Name, &u.Phone, &u.Status, &u.Role)
		if err != nil {
			return nil, errors.New("failed to scan User data: " + err.Error())
		}
		users = append(users, u)
	}

	if err = rows.Err(); err != nil {
		return nil, errors.New("error occurred during rows iteration: " + err.Error())
	}

	return users, nil
}

func GetUserInformationById(userId int64, role string) (User, error) {
	var query string
	var user User

	switch role {
	case "customer":
		query = `SELECT id, name, gmail, phone FROM customers WHERE id = ?`
	case "staff":
		query = `SELECT id, name, gmail, phone, restaurant_id FROM staffs WHERE id = ?`
	case "admin":
		query = `SELECT id, name, gmail, phone FROM admin WHERE id = ?`
	case "owner":
		query = `SELECT id, name, gmail, phone FROM owners WHERE id = ?`
	default:
		return user, errors.New("invalid role provided")
	}

	row := db.DB.QueryRow(query, userId)
	var err error
	if role == "staff" {
		err = row.Scan(&user.Id, &user.Name, &user.Email, &user.Phone, &user.Orther_id)
	} else {
		err = row.Scan(&user.Id, &user.Name, &user.Email, &user.Phone)
	}

	if err != nil {
		if err == sql.ErrNoRows {
			return user, errors.New("user not found with the provided ID")
		}
		return user, errors.New("failed to retrieve user information: " + err.Error())
	}

	user.Role = role
	return user, nil
}

func SetUserStatusInactive(email, role string) error {
	var query string
	switch role {
	case "customer":
		query = `UPDATE customers SET status = 'inactive' WHERE gmail = ?`
	case "staff":
		query = `UPDATE staffs SET status = 'inactive' WHERE gmail = ?`
	case "owner":
		query = `UPDATE owners SET status = 'inactive' WHERE gmail = ?`
	default:
		return errors.New("invalid role provided for setting User status")
	}

	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return errors.New("failed to prepare the SQL statement for setting User status: " + err.Error())
	}
	defer stmt.Close()

	_, err = stmt.Exec(email)
	if err != nil {
		return errors.New("failed to execute the SQL statement for setting User status: " + err.Error())
	}
	return nil
}

// Update information

func (u *User) UpdateCustomer() error {
	query := `UPDATE customers SET name = ?, phone = ?
    WHERE gmail = ?`
	stmt, err := db.DB.Prepare(query)
	if err != nil {
		panic(err)
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec(u.Name, u.Phone, u.Email)
	if err != nil {
		panic(err)
		return err
	}
	return nil
}

func (u *User) UpdateOwner() error {
	query := `UPDATE owners SET name = ?, phone = ?
    WHERE gmail = ?`
	stmt, err := db.DB.Prepare(query)
	if err != nil {
		panic(err)
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec(u.Name, u.Phone, u.Email)
	if err != nil {
		panic(err)
		return err
	}
	return nil
}

func (u *User) UpdateStaff() error {
	query := `UPDATE staffs SET name = ?, phone = ?
    WHERE gmail = ?`
	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return errors.New("failed to prepare the SQL statement for setting User status: " + err.Error())
	}
	defer stmt.Close()

	// _, err = stmt.Exec(email)
	return err
}

func (acc *User) ChangePassword(pass NewPassword) error {
	retrievedPassword, _ := CheckUser(acc)
	ok := utils.PasswordVerify(pass.OldPassword, retrievedPassword)
	if !ok {
		return errors.New("Old password is not true!")
	}
	hashPassword, err := utils.HashPassword(pass.NewPassword)
	if err != nil {
		panic(err)
		return err
	}
	query := `
	UPDATE customers SET password = ?
	WHERE gmail = ?
	`

	stmt, err := db.DB.Prepare(query)
	if err != nil {
		panic(err)
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec(hashPassword, acc.Email)
	if err != nil {
		panic(err)
		return err
	}
	return nil
}
