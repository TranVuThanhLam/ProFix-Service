package models

import (
	"profix-service/internal/db"
	"time"
)

type Service struct {
	ID          int    `json:"id"`
	Status      string `json:"status"`
	Category    string `json:"category"`
	Price       int `json:"price"`
	Description string `json:"description"`
	Title       string `json:"title"`
	ProviderId  int64  `json:"provider_id"`
	CreatedAt   time.Time `json:"created_at"`
}

func (s *Service) Create() (int64, error) {
	query := `INSERT INTO services (status, category, price, description, title, provider_id)
			  VALUES (?, ?, ?, ?, ?, ?)`
	result, err := db.DB.Exec(query, s.Status, s.Category, s.Price, s.Description, s.Title, s.ProviderId)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

func GetAllServices() ([]Service, error) {
	query := `SELECT id, created_at, status, category, price, description, title, provider_id FROM services`
	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var services []Service
	for rows.Next() {
		var s Service
		if err := rows.Scan(&s.ID, &s.CreatedAt, &s.Status, &s.Category, &s.Price, &s.Description, &s.Title, &s.ProviderId); err != nil {
			return nil, err
		}
		services = append(services, s)
	}
	return services, nil
}

func GetServiceByID(id int64) (*Service, error) {
	query := `SELECT id, created_at, status, category, price, description, title, provider_id FROM services WHERE id = ?`
	var s Service
	err := db.DB.QueryRow(query, id).Scan(&s.ID, &s.CreatedAt, &s.Status, &s.Category, &s.Price, &s.Description, &s.Title, &s.ProviderId)
	if err != nil {
		return nil, err
	}
	return &s, nil
}

func (s *Service) Update() error {
	query := `UPDATE services SET created_at = ?, status = ?, category = ?, price = ?, description = ?, title = ?, provider_id = ? WHERE id = ?`
	_, err := db.DB.Exec(query, s.CreatedAt, s.Status, s.Category, s.Price, s.Description, s.Title, s.ProviderId, s.ID)
	return err
}

func DeleteService(id int64) error {
	query := `DELETE FROM services WHERE id = ?`
	_, err := db.DB.Exec(query, id)
	return err
}

func GetAllServicesByProviderId(providerId int64) ([]Service, error) {
	query := `SELECT id, created_at, status, category, price, description, title, provider_id FROM services WHERE provider_id = ?`
	rows, err := db.DB.Query(query, providerId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var services []Service
	for rows.Next() {
		var s Service
		if err := rows.Scan(&s.ID, &s.CreatedAt, &s.Status, &s.Category, &s.Price, &s.Description, &s.Title, &s.ProviderId); err != nil {
			return nil, err
		}
		services = append(services, s)
	}
	return services, nil
}
