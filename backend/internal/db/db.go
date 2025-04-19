package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func InitDB() {
	var err error = nil
	DB, err = sql.Open("mysql", "root:123@tcp(db:3306)/profix-service?parseTime=true")
	if err == nil && DB.Ping() == nil {
		log.Println("Connected to db:3306")
	} else {
		log.Println("Failed to connect to db:3306, trying localhost:3307")
	
		DB, err = sql.Open("mysql", "root:123@tcp(localhost:3307)/profix-service?parseTime=true")
		if err != nil || DB.Ping() != nil {
			log.Fatalf("Cannot connect to either database: %v", err)
		}
	}
	
	
	// _, err = DB.Exec("CREATE DATABASE IF NOT EXISTS `profix-service`")
	// if err != nil {
	// 	panic("Cannot create database: " + err.Error())
	// }
	// DB.Close()
	DB.SetMaxOpenConns(10)
	DB.SetMaxIdleConns(5)

	createTable()
}

func createTable() {
	UserQuery := `
	CREATE TABLE IF NOT EXISTS users (
		id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(100),
		email VARCHAR(100) UNIQUE NOT NULL,
		password VARCHAR(255) NOT NULL,
		phone VARCHAR(20),
		role ENUM('customer', 'provider', 'admin') NOT NULL,
		status ENUM('active', 'inactive') DEFAULT 'active',
		image_url VARCHAR(255)
	);`
	_, err := DB.Exec(UserQuery)
	if err != nil {
		fmt.Println(err.Error())
	}

	ServiceQuery := `
	CREATE TABLE IF NOT EXISTS services (
		id INT AUTO_INCREMENT PRIMARY KEY,
		provider_id INT NOT NULL,
		title VARCHAR(100) NOT NULL,
		description TEXT,
		price DECIMAL(10,2),
		category VARCHAR(50),
		status ENUM('available', 'unavailable') DEFAULT 'available',
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (provider_id) REFERENCES users(id)
	);`
	_, err = DB.Exec(ServiceQuery)
	if err != nil {
		panic(err)
	}

	BookingQuery := `
	CREATE TABLE IF NOT EXISTS bookings (
		id INT AUTO_INCREMENT PRIMARY KEY,
		user_id INT NOT NULL,
		service_id INT NOT NULL,
		booking_time DATETIME NOT NULL,
		status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
		total_price DECIMAL(10,2),
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (user_id) REFERENCES users(id),
		FOREIGN KEY (service_id) REFERENCES services(id)
	);`
	_, err = DB.Exec(BookingQuery)
	if err != nil {
		panic(err)
	}

	ReviewQuery := `
	CREATE TABLE IF NOT EXISTS reviews (
		id INT AUTO_INCREMENT PRIMARY KEY,
		user_id INT NOT NULL,
		service_id INT NOT NULL,
		rating INT CHECK (rating >= 1 AND rating <= 5),
		comment TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (user_id) REFERENCES users(id),
		FOREIGN KEY (service_id) REFERENCES services(id)
	);`
	_, err = DB.Exec(ReviewQuery)
	if err != nil {
		panic(err)
	}

	MessageQuery := `
	CREATE TABLE IF NOT EXISTS messages (
		id INT AUTO_INCREMENT PRIMARY KEY,
		sender_id INT NOT NULL,
		receiver_id INT NOT NULL,
		content TEXT NOT NULL,
		sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (sender_id) REFERENCES users(id),
		FOREIGN KEY (receiver_id) REFERENCES users(id)
	);`
	_, err = DB.Exec(MessageQuery)
	if err != nil {
		panic(err)
	}

	NotificationQuery := `
	CREATE TABLE IF NOT EXISTS notifications (
		id INT AUTO_INCREMENT PRIMARY KEY,
		user_id INT NOT NULL,
		content TEXT NOT NULL,
		is_read BOOLEAN DEFAULT FALSE,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (user_id) REFERENCES users(id)
	);`
	_, err = DB.Exec(NotificationQuery)
	if err != nil {
		panic(err)
	}

	ServiceImagesQuery := `
	CREATE TABLE IF NOT EXISTS service_images (
		id INT AUTO_INCREMENT PRIMARY KEY,
		service_id INT NOT NULL,
		image_url VARCHAR(255) NOT NULL,
		FOREIGN KEY (service_id) REFERENCES services(id)
	);`
	_, err = DB.Exec(ServiceImagesQuery)
	if err != nil {
		panic(err)
	}
}
