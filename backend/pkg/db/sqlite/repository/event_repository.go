package repo

import (
	"database/sql"
	"errors"
	model "forum/pkg/internal/models"
	"forum/pkg/tools"
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
		m, _ := GetEventMembersByEventID(db, e.EventID)
		e.Members = len(m)
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

// Get event members by eventID
func GetEventMembersByEventID(db *sql.DB, eventID string) ([]string, error) {
	// Vérifier si le groupe existe
	var existingeventID string
	err := db.QueryRow("SELECT event_id FROM event_members WHERE event_id = ?", eventID).Scan(&existingeventID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("l'evenement n'existe pas")
		}
		return nil, err
	}

	// Récupérer les membres du groupe
	var groupUsers string
	err = db.QueryRow("SELECT user_id FROM event_members WHERE event_id = ?", eventID).Scan(&groupUsers)
	if err != nil {
		return nil, err
	}

	// Séparer la chaîne des membres en un tableau de membres
	members := strings.Split(groupUsers, ",")
	return members, nil
}

// Get Group by eventID
func GetGroupByEventID(db *sql.DB, eventID string) (model.Group, error) {
	querySQL := `SELECT * FROM groups WHERE group_id = (SELECT group_id FROM event WHERE event_id = ?);`
	row := db.QueryRow(querySQL, eventID)

	var group model.Group
	err := row.Scan(&group.GroupId, &group.GroupTitle, &group.GroupDesc, &group.GroupOwner, &group.GroupUsers, &group.CreatedAt)
	if err == sql.ErrNoRows {
		tools.Log("Groupe avec l'ID introuvable pour l'événement : " + eventID)
		return model.Group{}, err
	} else if err != nil {
		tools.Log(err)
		return model.Group{}, err
	}

	return group, nil
}
