package repo

import (
	"database/sql"
	"html"

	model "forum/pkg/internal/models"
	"forum/pkg/tools"
)

// Create a new Message
func CreateMessage(db *sql.DB, message model.Message) error {
	insertSQL := `
	   INSERT INTO messages (message_id, sender_id, receiver_id, content, sender_name, created_at, vu) VALUES (?, ?, ?, ?, ?, ?, ?);`
	_, err := db.Exec(insertSQL, message.MessageID, message.SenderID, message.ReceiverID, html.EscapeString(message.Content), html.EscapeString(message.SenderName), message.CreatedAt, message.Vu)
	return err
}

// Read all Messages from database
func GetMessagesByUser(db *sql.DB, userID string) ([]model.Message, error) {
	querySQL := `SELECT message_id, receiver_id, sender_id, sender_name, content, created_at, vu
	             FROM messages WHERE sender_id = ? OR receiver_id = ?;`
	rows, err := db.Query(querySQL, userID, userID)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()

	var messages []model.Message
	for rows.Next() {
		var message model.Message
		if err := rows.Scan(&message.MessageID, &message.ReceiverID, &message.SenderID, &message.SenderName, &message.Content, &message.CreatedAt, &message.Vu); err != nil {
			tools.Log(err)
			return nil, err
		}
		messages = append(messages, message)
	}
	return messages, nil
}

// Read a Message by ID
func GetMessageByID(db *sql.DB, messageID string) (model.Message, error) {
	querySQL := `SELECT message_id, sender_id, receiver_id, content, sender_name, created_at FROM messages WHERE message_id = ?;`
	var message model.Message
	err := db.QueryRow(querySQL, messageID).Scan(&message.MessageID, &message.SenderID, &message.ReceiverID, &message.Content, &message.SenderName, &message.CreatedAt)
	if err != nil {
		tools.Log(err)
		return model.Message{}, err
	}
	return message, nil
}

// UpdateMessageVisibility met à jour la visibilité d'un message dans la base de données.
func UpdateMessageVisibility(db *sql.DB, receiverID string, newVisibility bool) error {
	// Prépare la requête SQL pour mettre à jour les colonnes 'vu' pour les messages du destinataire donné
	stmt, err := db.Prepare("UPDATE messages SET vu = ? WHERE receiver_id = ?")
	if err != nil {
		return err
	}
	defer stmt.Close()

	// Créer un sql.NullBool avec la nouvelle visibilité
	vu := sql.NullBool{Valid: true, Bool: newVisibility}

	// Exécute la requête avec les paramètres fournis
	_, err = stmt.Exec(vu, receiverID)
	if err != nil {
		return err
	}

	return nil
}
