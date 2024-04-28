package repo

import (
	"database/sql"
	"errors"
	model "forum/internal/models"
	"forum/internal/tools"
	"html"
	"strings"
)

// Create a new Comment
func CreateGroup(db *sql.DB, group model.Group) error {
	insertSQL := `INSERT INTO groups (group_id, group_title, group_desc, group_owner, group_users, created_at) VALUES (?, ?, ?, ?, ?, ?);`
	_, err := db.Exec(insertSQL, group.GroupId, html.EscapeString(group.GroupTitle), html.EscapeString(group.GroupDesc), group.GroupOwner, group.GroupUsers, group.CreatedAt)
	return err
}

func GetGroups(db *sql.DB) ([]model.Group, error) {
	querySQL := `SELECT group_id, group_title, group_desc, group_owner, group_users, created_at
	             FROM groups;`
	rows, err := db.Query(querySQL)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()

	var groups []model.Group
	for rows.Next() {
		var group model.Group
		if err := rows.Scan(&group.GroupId, &group.GroupTitle, &group.GroupDesc, &group.GroupOwner, &group.GroupUsers, &group.CreatedAt); err != nil {
			tools.Log(err)
			return nil, err
		}
		groups = append(groups, group)
	}
	return groups, nil
}

// AddMemberToGroup ajoute un membre à un groupe à partir de l'ID du groupe
func AddMemberToGroup(db *sql.DB, groupID, userID string) error {
	// Vérifier si le groupe existe
	var existingGroupID string
	err := db.QueryRow("SELECT group_id FROM groups WHERE group_id = ?", groupID).Scan(&existingGroupID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return errors.New("le groupe n'existe pas")
		}
		return err
	}

	// Récupérer les membres actuels du groupe
	var groupUsers string
	err = db.QueryRow("SELECT group_users FROM groups WHERE group_id = ?", groupID).Scan(&groupUsers)
	if err != nil {
		return err
	}

	// Ajouter le nouvel utilisateur à la liste des membres
	// verifier si l'id n'est pas dans la liste
	if!strings.Contains(groupUsers, userID) {
    groupUsers += "," + userID
  }

	// Mettre à jour la liste des membres dans la base de données
	_, err = db.Exec("UPDATE groups SET group_users = ? WHERE group_id = ?", groupUsers, groupID)
	if err != nil {
		return err
	}

	return nil
}

// GetGroupMembers retourne la liste des membres d'un groupe à partir de l'ID du groupe
func GetGroupMembers(db *sql.DB, groupID string) ([]string, error) {
	// Vérifier si le groupe existe
	var existingGroupID string
	err := db.QueryRow("SELECT group_id FROM groups WHERE group_id = ?", groupID).Scan(&existingGroupID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("le groupe n'existe pas")
		}
		return nil, err
	}

	// Récupérer les membres du groupe
	var groupUsers string
	err = db.QueryRow("SELECT group_users FROM groups WHERE group_id = ?", groupID).Scan(&groupUsers)
	if err != nil {
		return nil, err
	}

	// Séparer la chaîne des membres en un tableau de membres
	members := strings.Split(groupUsers, ",")
	return members, nil
}
