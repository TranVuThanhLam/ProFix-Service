package models

import "profix-service/internal/db"

type Booking struct {
	Id          int64  `json:"id"`
	UserId      int64  `json:"user_id"`
	ServiceId   string `json:"service_id"`
	BookingTime string `json:"booking_time"`
	Status      string `json:"status"`
	TotalPrice  int `json:"total_price"`
	CreatedAt   string `json:"created_at"`
}

func (b *Booking) Create() (int64, error) {
	query := `INSERT INTO bookings (user_id, service_id, booking_time, status, total_price, created_at)
			  VALUES (?, ?, ?, ?, ?, ?)`

	result, err := db.DB.Exec(query, b.UserId, b.ServiceId, b.BookingTime, b.Status, b.TotalPrice, b.CreatedAt)
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
