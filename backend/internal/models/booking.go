package models

import (
	"fmt"
	"profix-service/internal/db"
	"strings"
)

type Booking struct {
	Id          int64  `json:"id"`
	UserId      int64  `json:"user_id"`
	ServiceId   int64 `json:"service_id"`
	BookingTime string `json:"booking_time"`
	Status      string `json:"status"`
	TotalPrice  int `json:"total_price"`
	CreatedAt   string `json:"created_at"`
	// ========================
	ServiceName string `json:"service_name"`
	CustomerName string `json:"customer_name"`
	ProviderName string `json:"provider_name"`
}

func (b *Booking) Create() (int64, error) {
	query := `INSERT INTO bookings (user_id, service_id, booking_time, total_price)
			  VALUES (?, ?, ?, ?)`
	fmt.Println(b)
	result, err := db.DB.Exec(query, b.UserId, b.ServiceId, b.BookingTime, b.TotalPrice)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

func GetAllBookings() ([]Booking, error) {
	query := `SELECT id, user_id, service_id, booking_time, status, total_price, created_at FROM bookings`

	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var bookings []Booking
	for rows.Next() {
		var b Booking
		if err := rows.Scan(&b.Id, &b.UserId, &b.ServiceId, &b.BookingTime, &b.Status, &b.TotalPrice, &b.CreatedAt); err != nil {
			return nil, err
		}
		bookings = append(bookings, b)
	}
	return bookings, nil
}

func GetBookingByID(id int64) (*Booking, error) {
	query := `SELECT id, user_id, service_id, booking_time, status, total_price, created_at FROM bookings WHERE id = ?`

	var b Booking
	err := db.DB.QueryRow(query, id).Scan(&b.Id, &b.UserId, &b.ServiceId, &b.BookingTime, &b.Status, &b.TotalPrice, &b.CreatedAt)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			return nil, nil
		}
		return nil, err
	}
	return &b, nil
}

func (b *Booking) Update() error {
	query := `UPDATE bookings SET user_id = ?, service_id = ?, booking_time = ?, status = ?, total_price = ?, created_at = ? WHERE id = ?`
	_, err := db.DB.Exec(query, b.UserId, b.ServiceId, b.BookingTime, b.Status, b.TotalPrice, b.CreatedAt, b.Id)
	return err
}

func DeleteBooking(id int64) error {
	query := `DELETE FROM bookings WHERE id = ?`
	_, err := db.DB.Exec(query, id)
	return err
}

// ============================================
func GetAllBookingsByCustomerId(userid int64) ([]Booking, error) {
	query := `		
		SELECT 
			b.id, b.user_id, b.service_id, b.booking_time, b.status, b.total_price, b.created_at,
			s.title AS service_name,
			cus.name AS customer_name,
			prov.name AS provider_name
		FROM 
			bookings b
		JOIN 
			services s ON b.service_id = s.id
		JOIN 
			users cus ON b.user_id = cus.id
		JOIN 
			users prov ON s.provider_id = prov.id WHERE user_id = ?`

	rows, err := db.DB.Query(query, userid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var bookings []Booking
	for rows.Next() {
		var b Booking
		if 		err := rows.Scan(
			&b.Id, &b.UserId, &b.ServiceId, &b.BookingTime,
			&b.Status, &b.TotalPrice, &b.CreatedAt,
			&b.ServiceName, &b.CustomerName, &b.ProviderName,
		); err != nil {
			return nil, err
		}
		bookings = append(bookings, b)
	}
	return bookings, nil		
}

func GetAllBookingsByProviderId(providerId int64) ([]Booking, error) {
	query := `
		SELECT 
			b.id, b.user_id, b.service_id, b.booking_time, b.status, b.total_price, b.created_at,
			s.title AS service_name,
			cus.name AS customer_name,
			prov.name AS provider_name
		FROM 
			bookings b
		JOIN 
			services s ON b.service_id = s.id
		JOIN 
			users cus ON b.user_id = cus.id
		JOIN 
			users prov ON s.provider_id = prov.id
		WHERE 
			s.provider_id = ?`

	rows, err := db.DB.Query(query, providerId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var bookings []Booking
	for rows.Next() {
		var b Booking
		err := rows.Scan(
			&b.Id, &b.UserId, &b.ServiceId, &b.BookingTime,
			&b.Status, &b.TotalPrice, &b.CreatedAt,
			&b.ServiceName, &b.CustomerName, &b.ProviderName,
		)
		if err != nil {
			return nil, err
		}
		bookings = append(bookings, b)
	}
	return bookings, nil
}

func (b *Booking) UpdateFields(updates map[string]interface{}) error {
	var setClauses []string
	var args []interface{}

	for field, value := range updates {
		setClauses = append(setClauses, fmt.Sprintf("%s = ?", field))
		args = append(args, value)
	}

	if len(setClauses) == 0 {
		return fmt.Errorf("no valid fields to update")
	}

	args = append(args, b.Id)

	query := fmt.Sprintf("UPDATE bookings SET %s WHERE id = ?", strings.Join(setClauses, ", "))
	_, err := db.DB.Exec(query, args...)
	return err
}
