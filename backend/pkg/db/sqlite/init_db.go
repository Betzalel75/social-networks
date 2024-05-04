package bd

import (
	"database/sql"
	"forum/pkg/tools"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

var (
	dbConn *sql.DB
)

type DB struct {
	dbConn *sql.DB
}

func InitDB() (*DB, error) {
	db, err := sql.Open("sqlite3", "../backend/pkg/db/sqlite/forum.sqlite")
	if err != nil {
		tools.Log(err)
		log.Fatal(err)
	}
	dbConn = db
	return &DB{db}, nil
}

// GetDB returns the active database connection.
func GetDB() *sql.DB {
	return dbConn
}
