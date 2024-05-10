package repo

import (
	"database/sql"
	model "forum/pkg/internal/models"
	"forum/pkg/tools"
)

// Create a new key
func CreateKey(db *sql.DB, key model.Key) error {
	stmt, err := db.Prepare("INSERT INTO keys (key_id, user_id, key, private) VALUES (?, ?, ?, ?);")
	if err != nil {
		tools.Log(err)
		return err
	}
	_, err = stmt.Exec(key.KeyID, key.UserID, key.Key, key.Private)
	if err != nil {
		tools.Log(err)
		return err
	}
	return nil
}

// Update table keys with key_id
func UpdateKey(db *sql.DB, key model.Key) error {
	stmt, err := db.Prepare("UPDATE keys SET key = ?, private = ? WHERE key_id = ?;")
	if err != nil {
		tools.Log(err)
		return err
	}
	_, err = stmt.Exec(key.Key, key.Private, key.KeyID)
	if err != nil {
		tools.Log(err)
		return err
	}
	return nil
}

// Get All Keys by userID
func GetKeysByKeyID(db *sql.DB, userID string) ([]model.Key, error) {
	// Préparation de la requête SQL
	stmt, err := db.Prepare("SELECT key_id, user_id, key, private FROM keys WHERE user_id = ? AND private = false;")
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer stmt.Close()

	// Exécution de la requête et récupération des résultats
	rows, err := stmt.Query(userID)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()

	var keys []model.Key
	// Parcourir les lignes résultantes
	for rows.Next() {
		var key model.Key
		err := rows.Scan(&key.KeyID, &key.UserID, &key.Key, &key.Private)
		if err != nil {
			tools.Log(err)
			return nil, err
		}
		keys = append(keys, key)
	}

	if err := rows.Err(); err != nil {
		tools.Log(err)
		return nil, err
	}

	return keys, nil
}

// GetAllNonPrivateKeysByUserID récupère toutes les clés privées associées à un utilisateur en utilisant son identifiant (userID).
func GetAllPrivateKeysByUserID(db *sql.DB, userID string) ([]model.Key, error) {
	// Préparation de la requête SQL
	stmt, err := db.Prepare("SELECT key_id, user_id, key, private FROM keys WHERE user_id = ?;")
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer stmt.Close()

	// Exécution de la requête et récupération des résultats
	rows, err := stmt.Query(userID)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()

	var keys []model.Key
	// Parcourir les lignes résultantes
	for rows.Next() {
		var key model.Key
		err := rows.Scan(&key.KeyID, &key.UserID, &key.Key, &key.Private)
		if err != nil {
			tools.Log(err)
			return nil, err
		}
		keys = append(keys, key)
	}

	if err := rows.Err(); err != nil {
		tools.Log(err)
		return nil, err
	}

	return keys, nil
}

// GetAllCircleKeysByUserID récupère toutes les clés presque privées associées à un utilisateur en utilisant son identifiant (userID).
func GetAllCircleKeysByUserID(db *sql.DB, userID string) ([]model.Key, error) {
	// Préparation de la requête SQL
	stmt, err := db.Prepare("SELECT key_id, user_id, key, private FROM keys WHERE user_id = ? AND private = true;")
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer stmt.Close()

	// Exécution de la requête et récupération des résultats
	rows, err := stmt.Query(userID)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()

	var keys []model.Key
	// Parcourir les lignes résultantes
	for rows.Next() {
		var key model.Key
		err := rows.Scan(&key.KeyID, &key.UserID, &key.Key, &key.Private)
		if err != nil {
			tools.Log(err)
			return nil, err
		}
		keys = append(keys, key)
	}

	if err := rows.Err(); err != nil {
		tools.Log(err)
		return nil, err
	}

	return keys, nil
}
