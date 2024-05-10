package repo

import (
	"database/sql"
	model "forum/pkg/internal/models"
	"forum/pkg/tools"
)

// Create a new key
func CreateUserKey(db *sql.DB, sharedUserID, keyID string) error {
	stmt, err := db.Prepare("INSERT INTO user_key (user_id, key_id) VALUES (?, ?);")
	if err != nil {
		tools.Log(err)
		return err
	}
	defer stmt.Close()

	// Exécute la requête avec les paramètres fournis
	_, err = stmt.Exec(sharedUserID, keyID)
	if err != nil {
		return err
	}

	return nil
}

// GetAllKeysByUserID récupère toutes les clés associées à un utilisateur en utilisant son identifiant (userID).
func GetAllKeysByUserID(db *sql.DB, userID string) ([]model.Key, error) {
	// Préparation de la requête SQL
	stmt, err := db.Prepare("SELECT user_id, key_id FROM user_key WHERE user_id = ?;")
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
		err := rows.Scan(&key.UserID, &key.KeyID)
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

// Delete Keys by keyID
func DeleteKeysBykeyID(db *sql.DB, keyID string) error {
  stmt, err := db.Prepare("DELETE FROM user_key WHERE key_id = ?;")
  if err != nil {
    tools.Log(err)
    return err
  }
  defer stmt.Close()

  _, err = stmt.Exec(keyID)
  if err != nil {
    tools.Log(err)
    return err
  }

  return nil
}