package bd

import (
	"database/sql"
	"fmt"
	"forum/internal/tools"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

var (
	dbConn *sql.DB
)

// InitDB initializes the database connection and performs setup.
func InitDB(path string) error {
	var value string
	if path == "" {
		value = "./internal/database/forum.sqlite"
	} else {
		value = path
	}
	// Open a database connection.
	fmt.Println(value)
	db, err := sql.Open("sqlite3", value)
	if err != nil {
		tools.Log(err)
		log.Fatal(err)
	}

	dbConn = db

	CreateGroupsTable(db)
	CreateUsersTable(db)
	CreatePostsTable(db)
	CreateLikesTable(db)
	CreateCommentsTable(db)
	CreateCategoriesTable(db)
	CreateSessionsTable(db)
	CreateMessagesTable(db)
	CreateFollowTable(db)
	CreateEventTable(db)
	CreateNotificationsTable(db)
	CreateKeysTable(db)
	CreateUserKeyTable(db)
	CreateGroupPostsTable(db)
	// CreateLikesCommentTable(db)

	return nil
}

// GetDB returns the active database connection.
func GetDB() *sql.DB {
	return dbConn
}
