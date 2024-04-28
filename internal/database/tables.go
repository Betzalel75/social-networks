package bd

import (
	"database/sql"
	"forum/internal/tools"
	"log"
)

// Create the Categories table
func CreateCategoriesTable(db *sql.DB) {
	createTableSQL := `
        CREATE TABLE IF NOT EXISTS categories (
            category_id TEXT PRIMARY KEY UNIQUE,
            post_id TEXT,
            name TEXT
        );`
	_, err := db.Exec(createTableSQL)
	if err != nil {
		tools.Log(err)
		log.Fatal(err)
	}
}

// Create the Follow table
func CreateFollowTable(db *sql.DB) {
	createTableSQL := `
        CREATE TABLE IF NOT EXISTS follow (
            follow_id TEXT PRIMARY KEY UNIQUE,
            user_id TEXT,
            followed_user TEXT,
            follow_type TEXT
        );`
	_, err := db.Exec(createTableSQL)
	if err != nil {
		tools.Log(err)
		log.Fatal(err)
	}
}

// Create the Comments table
func CreateCommentsTable(db *sql.DB) {
	createTableSQL := `
        CREATE TABLE IF NOT EXISTS comments (
            comment_id TEXT PRIMARY KEY UNIQUE,
            user_id TEXT NOT NULL,
            post_id TEXT NOT NULL,
            content TEXT,
            image TEXT
        );`
	_, err := db.Exec(createTableSQL)
	if err != nil {
		tools.Log(err)
		log.Fatal(err)
	}
}

// Create the Likes table
func CreateLikesTable(db *sql.DB) {
	createTableSQL := `
        CREATE TABLE IF NOT EXISTS likes (
            like_id TEXT PRIMARY KEY UNIQUE,
            user_id TEXT,
            post_id TEXT,
            comment_id TEXT,
            type INTEGER
        );`
	_, err := db.Exec(createTableSQL)
	if err != nil {
		tools.Log(err)
		log.Fatal(err)
	}
}

// Create the Posts table
func CreatePostsTable(db *sql.DB) {
	createTableSQL := `
        CREATE TABLE IF NOT EXISTS posts (
            post_id TEXT PRIMARY KEY UNIQUE,
            user_id TEXT,
            title TEXT,
            content TEXT,
            image TEXT,
            likeCount INTEGER,
            dislikeCount INTEGER,
            commentCount INTEGER,
            created_at DATETIME,
            private BOOLEAN
        );`
	_, err := db.Exec(createTableSQL)
	if err != nil {
		tools.Log(err)
		log.Fatal(err)
	}
}

// Create the Users table
func CreateUsersTable(db *sql.DB) {
	createTableSQL := `
    CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY UNIQUE,
        username TEXT,
        email TEXT,
        password TEXT,
        photo TEXT,
        age TEXT,
        gender TEXT,
        firstName TEXT,
        lastName TEXT,
        status_profile TEXT,
        key TEXT
    );`
	_, err := db.Exec(createTableSQL)
	if err != nil {
		tools.Log(err)
		log.Fatal(err)
	}
}

// Create the Users Session
func CreateSessionsTable(db *sql.DB) {
	createTableSQL := `
        CREATE TABLE IF NOT EXISTS sessions (
            session_id TEXT PRIMARY KEY UNIQUE,
            user_id TEXT,
            ttl DATETIME
        );`
	_, err := db.Exec(createTableSQL)
	if err != nil {
		tools.Log(err)
		log.Fatal(err)
	}
}

// Create the Messages table
func CreateMessagesTable(db *sql.DB) {
	createTableSQL := `
        CREATE TABLE IF NOT EXISTS messages (
            message_id TEXT PRIMARY KEY UNIQUE,
            sender_id TEXT,
            receiver_id TEXT,
            content TEXT,
            sender_name TEXT,
            created_at DATETIME,
            vu BOOLEAN
        );`
	_, err := db.Exec(createTableSQL)
	if err != nil {
		tools.Log(err)
		log.Fatal(err)
	}
}

// Table des evenements
func CreateEventTable(db *sql.DB) {
	createTableSQL := `
        CREATE TABLE IF NOT EXISTS event (
            event_id TEXT PRIMARY KEY UNIQUE,
            title TEXT,
            description TEXT,
            image TEXT,
            admin TEXT,
            date TEXT,
            group_id TEXT,
            FOREIGN KEY (group_id) REFERENCES groups(group_id)
        );`
	_, err := db.Exec(createTableSQL)
	if err != nil {
		tools.Log(err)
		log.Fatal(err)
	}
}

// Creat Table Event Members
func CreateEventMembersTable(db *sql.DB) {
	createTableSQL := `
        CREATE TABLE IF NOT EXISTS event_members (
            event_member_id TEXT PRIMARY KEY UNIQUE,
            event_id TEXT,
            user_id TEXT,
            FOREIGN KEY (event_id) REFERENCES event(event_id),
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        );`
	_, err := db.Exec(createTableSQL)
	if err != nil {
		tools.Log(err)
		log.Fatal(err)
	}
}

// Create the Groupes table
func CreateGroupsTable(db *sql.DB) {
	createTableSQL := `
        CREATE TABLE IF NOT EXISTS groups (
            group_id TEXT PRIMARY KEY UNIQUE,
            group_title TEXT,
            group_desc TEXT,
            group_owner TEXT,
            group_users TEXT,
            created_at DATETIME
        );`
	_, err := db.Exec(createTableSQL)
	if err != nil {
		tools.Log(err)
		log.Fatal(err)
	}
}

// Create the Keys table
func CreateKeysTable(db *sql.DB) {
	createTableSQL := `
        CREATE TABLE IF NOT EXISTS keys (
            key_id TEXT PRIMARY KEY UNIQUE,
            user_id TEXT,
            key TEXT,
            private BOOLEAN
        );`
	_, err := db.Exec(createTableSQL)
	if err != nil {
		tools.Log(err)
		log.Fatal(err)
	}
}

// Create the Notifications table
func CreateNotificationsTable(db *sql.DB) {
	createTableSQL := `
        CREATE TABLE IF NOT EXISTS notifications (
            notification_id TEXT PRIMARY KEY UNIQUE,
            user_id TEXT,
            recever_id TEXT,
            category TEXT,
            type TEXT,
            created_at DATETIME,
            vu BOOLEAN,
            source_id TEXT,
            FOREIGN KEY (user_id) REFERENCES users(user_id),
            FOREIGN KEY (recever_id) REFERENCES users(user_id)
        );`
	_, err := db.Exec(createTableSQL)
	if err != nil {
		tools.Log(err)
		log.Fatal(err)
	}
}

// Create Table User_key
func CreateUserKeyTable(db *sql.DB) {
	createTableSQL := `CREATE TABLE IF NOT EXISTS user_key (
        user_id TEXT,
        key_id TEXT,
        PRIMARY KEY (user_id, key_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (key_id) REFERENCES keys(key_id)
    );`
	_, err := db.Exec(createTableSQL)
	if err != nil {
		tools.Log(err)
		log.Fatal(err)
	}
}

// Create the Posts table
func CreateGroupPostsTable(db *sql.DB) {
	createTableSQL := `
        CREATE TABLE IF NOT EXISTS group_posts (
            post_id TEXT PRIMARY KEY UNIQUE,
            user_id TEXT,
            group_id TEXT,
            title TEXT,
            content TEXT,
            image TEXT,
            likeCount INTEGER,
            dislikeCount INTEGER,
            commentCount INTEGER,
            created_at DATETIME,
            private BOOLEAN,
            FOREIGN KEY (user_id) REFERENCES users(user_id),
            FOREIGN KEY (group_id) REFERENCES groups(group_id)
        );`
	_, err := db.Exec(createTableSQL)
	if err != nil {
		tools.Log(err)
		log.Fatal(err)
	}
}
