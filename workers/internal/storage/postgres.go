package storage

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Storage struct {
	DB *pgxpool.Pool
}

func NewPostgres(cntx context.Context, databaseURL string) (*Storage, error) {
	db, err := pgxpool.New(cntx, databaseURL)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(cntx); err != nil {
		db.Close()
		return nil, err
	}
	return &Storage{DB: db}, nil
}

func (s *Storage) Close() {
	s.DB.Close()
}
