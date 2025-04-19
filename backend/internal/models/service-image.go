package models

import (
	"profix-service/internal/db"
)

type ServiceImage struct {
	ID        int64  `json:"id"`
	ServiceId int64  `json:"service_id"`
	ImageUrl  string `json:"image_url"`
}

func (s *ServiceImage) Create() (int64, error) {
	query := `INSERT INTO service_images (service_id, image_url)
			  VALUES (?, ?)`
	result, err := db.DB.Exec(query, s.ServiceId, s.ImageUrl)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

func GetAllServiceImages() ([]ServiceImage, error) {
	query := `SELECT id, service_id, image_url FROM service_images`
	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var images []ServiceImage
	for rows.Next() {
		var s ServiceImage
		if err := rows.Scan(&s.ID, &s.ServiceId, &s.ImageUrl); err != nil {
			return nil, err
		}
		images = append(images, s)
	}
	return images, nil
}

func GetServiceImageByID(id int64) (*ServiceImage, error) {
	query := `SELECT id, service_id, image_url FROM service_images WHERE id = ?`
	var s ServiceImage
	err := db.DB.QueryRow(query, id).Scan(&s.ID, &s.ServiceId, &s.ImageUrl)
	if err != nil {
		return nil, err
	}
	return &s, nil
}

func (s *ServiceImage) Update() error {
	query := `UPDATE service_images SET service_id = ?, image_url = ? WHERE id = ?`
	_, err := db.DB.Exec(query, s.ServiceId, s.ImageUrl, s.ID)
	return err
}

func DeleteServiceImage(id int64) error {
	query := `DELETE FROM service_images WHERE id = ?`
	_, err := db.DB.Exec(query, id)
	return err
}
