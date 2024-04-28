package repo

import (
	"database/sql"
	"errors"
	model "forum/internal/models"
	"forum/internal/tools"
	"strings"
)

func CreateEvents(db *sql.DB, event model.Event) error {
	insertSQL := `
	   INSERT INTO event (event_id, title, description, image, admin, date, group_id) VALUES (?, ?, ?, ?, ?, ?,?);`
	_, err := db.Exec(insertSQL, &event.EventID, &event.Title, &event.Description, &event.Image, &event.UserID, &event.Date, &event.GroupID)
	return err
}

func GetEventByGroupId(db *sql.DB, idGroup string) ([]model.Event, error) {
	querySQL := `SELECT event_id, title, description, image,admin, date FROM event WHERE group_id = ?;`
	rows, err := db.Query(querySQL, idGroup)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()

	var event []model.Event
	for rows.Next() {
		var e model.Event
		if err := rows.Scan(&e.EventID, &e.Title, &e.Description, &e.Image, &e.UserID, &e.Date); err != nil {
			tools.Log(err)
			return nil, err
		}
		event = append(event, e)
	}

	return event, nil
}

// Creat Event Members
func CreateEventMembers(db *sql.DB, eventMember model.EventMember) error {
	insertSQL := `
     INSERT INTO event_members (event_member_id ,event_id, user_id) VALUES (?, ?, ?);`
	_, err := db.Exec(insertSQL, &eventMember.EventMemberID, &eventMember.EventID, &eventMember.UserID)
	return err
}

// Add Member into Event Members table
func AddMemberToEventMembers(db *sql.DB, eventID, userID string) error {
	// Vérifier si le groupe existe
	var existingeventID string
	err := db.QueryRow("SELECT event_id FROM event_members WHERE event_id = ?", eventID).Scan(&existingeventID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return errors.New("l'evenement n'existe pas")
		}
		return err
	}

	// Récupérer les membres actuels du groupe
	var groupUsers string
	err = db.QueryRow("SELECT user_id FROM event_members WHERE event_id = ?", eventID).Scan(&groupUsers)
	if err != nil {
		return err
	}

	// Ajouter le nouvel utilisateur à la liste des membres
	// verifier si l'id n'est pas dans la liste
	if !strings.Contains(groupUsers, userID) {
		groupUsers += "," + userID
	}

	// Mettre à jour la liste des membres dans la base de données
	_, err = db.Exec("UPDATE event_members SET user_id = ? WHERE event_id = ?", groupUsers, eventID)
	if err != nil {
		return err
	}

	return nil
}
