package repo

import (
	"database/sql"
	model "forum/internal/models"
	"forum/internal/tools"
	"html"

	_ "github.com/mattn/go-sqlite3"
)

// Create a new user
func CreateUser(db *sql.DB, user model.User) error {
	stmt, err := db.Prepare("INSERT INTO users (user_id, username, email, password, photo, age, gender, firstName, lastName,key, status_profile) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?);")
	if err != nil {
		tools.Log(err)
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(user.UserID, html.EscapeString(user.Username), html.EscapeString(user.Email), html.EscapeString(user.Password), html.EscapeString(user.Photo), user.Age, html.EscapeString(user.About), html.EscapeString(user.FirstName), html.EscapeString(user.LastName), user.Key, user.StatusProfil)

	return err
}

// Read all users
func GetUsers(db *sql.DB) ([]model.User, error) {
	querySQL := `SELECT user_id, username, email, password, photo, age, gender, firstName, lastName FROM users;`
	rows, err := db.Query(querySQL)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()

	var users []model.User
	for rows.Next() {
		var u model.User
		if err := rows.Scan(&u.UserID, &u.Username, &u.Email, &u.Password, &u.Photo, &u.Age, &u.About, &u.FirstName, &u.LastName); err != nil {
			tools.Log(err)
			return nil, err
		}
		users = append(users, u)
	}
	return users, nil
}

// Read a user by ID
func GetUserByID(db *sql.DB, userID string) (model.User, error) {
	querySQL := `SELECT user_id, username, email, password, photo, age, gender, firstName, lastName, status_profile FROM users WHERE user_id = ?;`
	var u model.User
	err := db.QueryRow(querySQL, userID).Scan(&u.UserID, &u.Username, &u.Email, &u.Password, &u.Photo, &u.Age, &u.About, &u.FirstName, &u.LastName, &u.StatusProfil)

	if err == sql.ErrNoRows {
		tools.Log("utilisateur avec l'ID introuvable " + userID)
	}

	if err != nil {
		tools.Log(err)
		return model.User{}, err
	}

	return u, nil
}

// Read a user by Email
func GetUserByEmail(db *sql.DB, email string) (model.User, error) {
	querySQL := `SELECT user_id, username, password, photo, age, gender, firstName, lastName,key FROM users WHERE email = ?;`
	var u model.User
	err := db.QueryRow(querySQL, email).Scan(&u.UserID, &u.Username, &u.Password, &u.Photo, &u.Age, &u.About, &u.FirstName, &u.LastName, &u.Key)
	return u, err
}

// Read a user by NickName
func GetUserByNickName(db *sql.DB, username string) (model.User, error) {
	querySQL := `SELECT user_id, email, password, photo, age, gender, firstName, lastName,key FROM users WHERE username = ?;`
	var u model.User
	err := db.QueryRow(querySQL, username).Scan(&u.UserID, &u.Email, &u.Password, &u.Photo, &u.Age, &u.About, &u.FirstName, &u.LastName, &u.Key)
	return u, err
}

// Update user email
func UpdateUser(db *sql.DB, userID string, newEmail, newUserName, newPassword, newPhoto string) error {
	stmt, err := db.Prepare("UPDATE users SET email = ?, username = ?, password = ?, photo = ? WHERE user_id = ?;")

	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(html.EscapeString(newEmail), html.EscapeString(newUserName), html.EscapeString(newPassword), html.EscapeString(newPhoto), userID)

	return err
}

func UpdateStatus(db *sql.DB, userID string, statusProfil string) error {
	stmt, err := db.Prepare("UPDATE users SET status_profile = ? WHERE user_id = ?;")

	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(html.EscapeString(statusProfil), userID)

	return err
}

// Delete a user by ID
func DeleteUser(db *sql.DB, userID string) error {
	deleteSQL := `DELETE FROM users WHERE user_id = ?;`
	_, err := db.Exec(deleteSQL, userID)
	return err
}

// Update user key
func UpdateUserKey(db *sql.DB, userID string, newKey string) error {
	stmt, err := db.Prepare("UPDATE users SET key = ? WHERE user_id = ?;")

	if err != nil {
		tools.Log(err)
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(newKey, userID)

	return err
}
