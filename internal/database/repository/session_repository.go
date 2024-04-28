package repo

import (
	"database/sql"
	model "forum/internal/models"
	"forum/internal/tools"
)

// Create a new Session
func CreateSession(db *sql.DB, session model.Session) error {
	stmt, err := db.Prepare("INSERT INTO Sessions (session_id, user_id, ttl) VALUES (?, ?, ?);")
	if err != nil {
		tools.Log(err)
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec(session.SessionID, session.UserID, session.Ttl)
	return err
}

// Read a Session by ID
func GetSessionByID(db *sql.DB, cookie string) (model.Session, error) {
	querySQL := `SELECT session_id, user_id, ttl FROM sessions WHERE session_id = ?;`
	var s model.Session
	err := db.QueryRow(querySQL, cookie).Scan(&s.SessionID, &s.UserID, &s.Ttl)
	if err != nil {
		tools.Log(err)
		return model.Session{}, err
	}
	return s, nil
}

func GetSessionByUserI(db *sql.DB, user_id string) (model.Session, error) {
	querySQL := `SELECT session_id, user_id, ttl FROM sessions WHERE user_id = ?;`
	var s model.Session
	err := db.QueryRow(querySQL, user_id).Scan(&s.SessionID, &s.UserID, &s.Ttl)
	if err != nil {
		// tools.Log(err)
		return model.Session{}, err
	}
	return s, nil
}

// Read a Session by ID
func GetUserIDBySession(db *sql.DB, SessionID string) (string, error) {
	querySQL := `SELECT session_id, user_id, ttl FROM sessions WHERE session_id = ?;`
	var s model.Session
	err := db.QueryRow(querySQL, SessionID).Scan(&s.SessionID, &s.UserID, &s.Ttl)
	if err != nil {
		tools.Log(err)
		return "", err
	}
	return s.UserID, nil
}

func GetAllSessions(db *sql.DB) ([]model.Session, error) {
	querySQL := `SELECT session_id, user_id, ttl FROM sessions;`
	rows, err := db.Query(querySQL)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()
	var sessions []model.Session
	for rows.Next() {
		var s model.Session
		err := rows.Scan(&s.SessionID, &s.UserID, &s.Ttl)
		if err != nil {
			tools.Log(err)
			return nil, err
		}
		sessions = append(sessions, s)
	}
	return sessions, nil
}

// Delete a Session by ID
func DeleteSession(db *sql.DB, cookie string) error {
	deleteSQL := `DELETE FROM sessions WHERE session_id = ?;`
	_, err := db.Exec(deleteSQL, cookie)
	return err
}
