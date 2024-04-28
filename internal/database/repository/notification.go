package repo

import (
	"database/sql"
	model "forum/internal/models"
	"forum/internal/tools"
	"html"
)

// Create a new Notification
func CreateNotification(db *sql.DB, notif model.Notification) error {
	// Vérification de l'existence de la notification
	queryExisting := `SELECT notification_id FROM notifications WHERE user_id = ? AND recever_id = ?;`
	row := db.QueryRow(queryExisting, notif.UserID, notif.Receiver_id)

	var existingNotificationID string
	if err := row.Scan(&existingNotificationID); err != nil {
		if err != sql.ErrNoRows {
			return err
		}
	} else {
		// Suppression de la notification existante si elle existe
		deleteSQL := `DELETE FROM notifications WHERE notification_id = ?;`
		_, err := db.Exec(deleteSQL, existingNotificationID)
		if err != nil {
			tools.Log(err)
			return err
		}
	}

	// Préparation de la requête d'insertion
	stmt, err := db.Prepare("INSERT INTO notifications (notification_id, user_id, recever_id, category, type, vu, created_at, source_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?);")
	if err != nil {
		tools.Log(err)
		return err
	}
	defer stmt.Close()

	// Exécution de la requête d'insertion
	_, err = stmt.Exec(notif.NotificationID, notif.UserID, html.EscapeString(notif.Receiver_id), html.EscapeString(notif.Category), html.EscapeString(notif.Type), notif.Vu, notif.CreatedAt, notif.GroupID)
	return err
}

// GetNotificationByUser retrieves notifications by receiver_id
func GetNotificationByUser(db *sql.DB, receiverID string, offset, notificationsPerPage int) ([]model.Notification, error) {
	querySQL := `SELECT notification_id, user_id, recever_id, category, type, vu, created_at, source_id FROM notifications WHERE recever_id = ? ORDER BY created_at DESC LIMIT ?, ?;`

	rows, err := db.Query(querySQL, receiverID, offset, notificationsPerPage)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()

	var notifs []model.Notification

	for rows.Next() {
		var n model.Notification
		err := rows.Scan(&n.NotificationID, &n.UserID, &n.Receiver_id, &n.Category, &n.Type, &n.Vu, &n.CreatedAt, &n.GroupID)
		if err != nil {
			tools.Log(err)
			return nil, err
		}
		notifs = append(notifs, n)
	}

	if err := rows.Err(); err != nil {
		tools.Log(err)
		return nil, err
	}

	return notifs, nil
}

func GetAllNotificationByUser(db *sql.DB, receiverID string) ([]model.Notification, error) {
	querySQL := `SELECT notification_id, user_id, recever_id, category, type, vu, created_at, source_id FROM notifications WHERE recever_id = ? ORDER BY created_at DESC;`

	rows, err := db.Query(querySQL, receiverID)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()

	var notifs []model.Notification

	for rows.Next() {
		var n model.Notification
		err := rows.Scan(&n.NotificationID, &n.UserID, &n.Receiver_id, &n.Category, &n.Type, &n.Vu, &n.CreatedAt, &n.GroupID)
		if err != nil {
			tools.Log(err)
			return nil, err
		}
		notifs = append(notifs, n)
	}

	if err := rows.Err(); err != nil {
		tools.Log(err)
		return nil, err
	}

	return notifs, nil
}

// UPDATE NOTIFICATION BY NOTIFICATION ID
func UpdateNotification(db *sql.DB, notificationId string, newVisibility bool) error {
	// Prépare la requête SQL pour mettre à jour les colonnes 'vu' pour les messages du destinataire donné
	stmt, err := db.Prepare("UPDATE notifications SET vu = ? WHERE notification_id = ?")
	if err != nil {
		return err
	}
	defer stmt.Close()

	// Créer un sql.NullBool avec la nouvelle visibilité
	vu := sql.NullBool{Valid: true, Bool: newVisibility}

	// Exécute la requête avec les paramètres fournis
	_, err = stmt.Exec(vu, notificationId)
	if err != nil {
		return err
	}

	return nil
}

// DELETE NOTIFICATION BY notification_ID
func DeleteNotification(db *sql.DB, notifID string) error {
	// Prépare la requête SQL pour mettre à jour les colonnes 'vu' pour les messages du destinataire donné
	stmt, err := db.Prepare("DELETE FROM notifications WHERE notification_id = ?")
	if err != nil {
		return err
	}
	defer stmt.Close()

	// Exécute la requête avec les paramètres fournis
	_, err = stmt.Exec(notifID)
	if err != nil {
		return err
	}

	return nil
}
