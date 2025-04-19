package models

import (
	"profix-service/internal/db"
)

type Review struct {
	ID        int64  `json:"id"`
	UserId    int64  `json:"user_id"`
	ServiceId int64  `json:"service_id"`
	Rating    string `json:"rating"`
	Comment   string `json:"comment"`
	CreatedAt string `json:"created_at"`
}

func (r *Review) Create() (int64, error) {
	query := `INSERT INTO reviews (user_id, service_id, rating, comment, created_at)
			  VALUES (?, ?, ?, ?, ?)`
	result, err := db.DB.Exec(query, r.UserId, r.ServiceId, r.Rating, r.Comment, r.CreatedAt)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

func GetAllReviews() ([]Review, error) {
	query := `SELECT id, user_id, service_id, rating, comment, created_at FROM reviews`
	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reviews []Review
	for rows.Next() {
		var r Review
		if err := rows.Scan(&r.ID, &r.UserId, &r.ServiceId, &r.Rating, &r.Comment, &r.CreatedAt); err != nil {
			return nil, err
		}
		reviews = append(reviews, r)
	}
	return reviews, nil
}

func GetReviewByID(id int64) (*Review, error) {
	query := `SELECT id, user_id, service_id, rating, comment, created_at FROM reviews WHERE id = ?`
	var r Review
	err := db.DB.QueryRow(query, id).Scan(&r.ID, &r.UserId, &r.ServiceId, &r.Rating, &r.Comment, &r.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &r, nil
}

func (r *Review) Update() error {
	query := `UPDATE reviews SET user_id = ?, service_id = ?, rating = ?, comment = ?, created_at = ? WHERE id = ?`
	_, err := db.DB.Exec(query, r.UserId, r.ServiceId, r.Rating, r.Comment, r.CreatedAt, r.ID)
	return err
}

func DeleteReview(id int64) error {
	query := `DELETE FROM reviews WHERE id = ?`
	_, err := db.DB.Exec(query, id)
	return err
}
