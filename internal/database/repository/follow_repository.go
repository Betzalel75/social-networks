package repo

import (
	"database/sql"
	"fmt"

	// "fmt"
	model "forum/internal/models"
	"forum/internal/tools"
)


func CreateFollow(db *sql.DB, follow model.Follow) error {
	queryExisting := `SELECT follow_id FROM follow WHERE user_id = ? AND followed_user = ?;`
	row := db.QueryRow(queryExisting, follow.UserID, follow.FollowedUser)

	var existingFollowID string
	if err := row.Scan(&existingFollowID); err != nil {
		if err != sql.ErrNoRows {
			return err
		}
	} else {
		
		deleteSQL := `DELETE FROM follow WHERE follow_id = ?;`
		_, err := db.Exec(deleteSQL, existingFollowID)
		if err != nil {
			fmt.Printf("Erreur ... : %v",err)
			fmt.Printf("\n")
		}
	}

	
	insertSQL := `
        INSERT INTO follow (follow_id, user_id, followed_user, follow_type) VALUES (?, ?, ?, ?);`
	_, err := db.Exec(insertSQL, follow.FollowID, follow.UserID, follow.FollowedUser, follow.FollowType)
	return err
}


func GetFollowersByUser(db *sql.DB, userID string) ([]model.Follow, error) {
	querySQL := `SELECT follow_id, user_id, followed_user FROM follow WHERE followed_user = ? AND follow_type = "follow";`
	rows, err := db.Query(querySQL, userID)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()

	var follows []model.Follow
	for rows.Next() {
		var follow model.Follow
		if err := rows.Scan(&follow.FollowID, &follow.UserID, &follow.FollowedUser); err != nil {
			tools.Log(err)
			return nil, err
		}
		follows = append(follows, follow)
	}
	if err := rows.Err(); err != nil {
		tools.Log(err)
		return nil, err
	}
	return follows, nil
}

func GetFollowedByUser(db *sql.DB, userID string) ([]model.Follow, error) {
	querySQL := `SELECT follow_id, user_id, followed_user FROM follow WHERE user_id = ? AND follow_type = "follow";`
	rows, err := db.Query(querySQL, userID)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()

	var follows []model.Follow
	for rows.Next() {
		var follow model.Follow
		if err := rows.Scan(&follow.FollowID, &follow.UserID, &follow.FollowedUser); err != nil {
			tools.Log(err)
			return nil, err
		}
		follows = append(follows, follow)
	}
	if err := rows.Err(); err != nil {
		tools.Log(err)
		return nil, err
	}
	return follows, nil
}
