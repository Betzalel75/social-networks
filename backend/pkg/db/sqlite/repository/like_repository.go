package repo

import (
	"database/sql"
	// "fmt"
	model "forum/pkg/internal/models"
	"forum/pkg/tools"
)

// Create a new Like
func CreateLike(db *sql.DB, like model.Like) error {
	insertSQL := `
        INSERT INTO likes (like_id, user_id, post_id, comment_id, type) VALUES (?, ?, ?, ?, ?);`
	_, err := db.Exec(insertSQL, like.LikeID, like.UserID, like.PostID, like.CommentID, like.Type)
	return err
}

// Read all Likes
func GetLikes(db *sql.DB) ([]model.Like, error) {
	querySQL := `SELECT like_id, user_id, post_id, comment_id, type FROM likes;`
	rows, err := db.Query(querySQL)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()

	var likes []model.Like
	for rows.Next() {
		var like model.Like
		if err := rows.Scan(&like.LikeID, &like.UserID, &like.PostID, &like.CommentID, &like.Type); err != nil {
			tools.Log(err)
			return nil, err
		}
		likes = append(likes, like)
	}
	return likes, nil
}

// Read all Likes
func GetLikesByPost(db *sql.DB, postID string) ([]model.Like, error) {
	querySQL := `SELECT like_id, user_id, post_id, comment_id, type FROM likes WHERE postID = ?;`
	rows, err := db.Query(querySQL, postID)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()

	var likes []model.Like
	for rows.Next() {
		var like model.Like
		if err := rows.Scan(&like.LikeID, &like.UserID, &like.PostID, &like.CommentID, &like.Type); err != nil {
			tools.Log(err)
			return nil, err
		}
		likes = append(likes, like)
	}
	return likes, nil
}

// Read a Like by ID
func GetLikeByID(db *sql.DB, likeID string) (model.Like, error) {
	querySQL := `SELECT like_id, user_id, post_id, comment_id, type FROM likes WHERE like_id = ?;`
	var like model.Like
	err := db.QueryRow(querySQL, likeID).Scan(&like.LikeID, &like.UserID, &like.PostID, &like.CommentID, &like.Type)
	if err != nil {
		tools.Log(err)
		return model.Like{}, err
	}
	return like, nil
}

// Read a Like by PostID and UserID
func GetLikeByPostAndUserID(db *sql.DB, userID, ID, name string) (model.Like, error) {
	querySQL := `SELECT like_id, user_id, post_id, comment_id, type FROM likes WHERE (user_id = ? AND post_id = ?);`
	if name == "comment_id" {
		querySQL = `SELECT like_id, user_id, post_id, comment_id, type FROM likes WHERE (user_id = ? AND comment_id = ?);`
	}
	var like model.Like
	err := db.QueryRow(querySQL, userID, ID).Scan(&like.LikeID, &like.UserID, &like.PostID, &like.CommentID, &like.Type)
	if err != nil {
		tools.Log(err)
		return model.Like{}, err
	}
	return like, nil
}

// count tthe number of like and dislike for a post
func CountLikes(db *sql.DB, name, ID string) (int, int, error) {
	query := `
        SELECT 
			COUNT(CASE WHEN type = 1 THEN 1 ELSE NULL END) AS likes_count,
            COUNT(CASE WHEN type = -1 THEN 1 ELSE NULL END) AS dislikes_count
        FROM likes WHERE post_id = ?;`

	if name == "comment_id" {
		query = `
        SELECT 
			COUNT(CASE WHEN type = 1 THEN 1 ELSE NULL END) AS likes_count,
            COUNT(CASE WHEN type = -1 THEN 1 ELSE NULL END) AS dislikes_count
        FROM likes WHERE comment_id = ?;`
	}
	var likesCount, dislikesCount int
	err := db.QueryRow(query, ID).Scan(&likesCount, &dislikesCount)
	if err != nil {
		tools.Log(err)
		return 0, 0, err
	}
	// fmt.Println(likesCount, dislikesCount)
	return likesCount, dislikesCount, nil
}

// count tthe number of like and dislike for a post
func CountLikesPost(db *sql.DB, name, ID string) (int, int, error) {
	query := `
        SELECT 
			COUNT(CASE WHEN type = 1 THEN 1 ELSE NULL END) AS likes_count,
            COUNT(CASE WHEN type = -1 THEN 1 ELSE NULL END) AS dislikes_count
        FROM likes WHERE ? = ?;`

	if name == "comment_id" {
		query = `
        SELECT 
			COUNT(CASE WHEN type = 1 THEN 1 ELSE NULL END) AS likes_count,
            COUNT(CASE WHEN type = -1 THEN 1 ELSE NULL END) AS dislikes_count
        FROM likes WHERE ? = ?;`
	}

	var likesCount, dislikesCount int
	err := db.QueryRow(query, ID).Scan(&likesCount, &dislikesCount)
	if err != nil {
		tools.Log(err)
		return 0, 0, err
	}

	return likesCount, dislikesCount, nil
}

// Update Like type
func UpdateLikeType(db *sql.DB, likeID string, newType int) error {
	updateSQL := `UPDATE likes SET type = ? WHERE like_id = ?;`
	_, err := db.Exec(updateSQL, newType, likeID)
	return err
}

// Delete a Like by ID
func DeleteLike(db *sql.DB, likeID string) error {
	deleteSQL := `DELETE FROM likes WHERE like_id = ?;`
	_, err := db.Exec(deleteSQL, likeID)
	return err
}

// Delete a Like by ID
func DeleteLikeAll(db *sql.DB) error {
	deleteSQL := `DELETE FROM likes;`
	_, err := db.Exec(deleteSQL)
	return err
}
