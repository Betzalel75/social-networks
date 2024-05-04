package repo

import (
	"database/sql"
	model "forum/pkg/internal/models"
	"forum/pkg/tools"
	"html"
)

// Create a new Comment
func CreateComment(db *sql.DB, comment model.Comment) error {
	insertSQL := `
        INSERT INTO comments (comment_id, user_id, post_id, content, image) VALUES (?, ?, ?, ?, ?);`
	_, err := db.Exec(insertSQL, comment.CommentID, comment.UserID, comment.PostID, html.EscapeString(comment.Content), comment.Image)
	return err
}

// Read all Comments
func GetComments(db *sql.DB) ([]model.Comment, error) {
	querySQL := `SELECT comment_id, user_id, post_id, content FROM comments;`
	rows, err := db.Query(querySQL)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()

	var comments []model.Comment
	for rows.Next() {
		var comment model.Comment
		if err := rows.Scan(&comment.CommentID, &comment.UserID, &comment.PostID, &comment.Content, &comment.Image); err != nil {
			tools.Log(err)
			return nil, err
		}
		comments = append(comments, comment)
	}
	return comments, nil
}

// Read all Comments
func GetCommentsByPost(db *sql.DB, postID string) ([]model.Comment, error) {
	querySQL := `SELECT comment_id, user_id, post_id, content, image FROM comments WHERE post_id = ?;`
	rows, err := db.Query(querySQL, postID)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()

	var comments []model.Comment
	for rows.Next() {
		var comment model.Comment
		if err := rows.Scan(&comment.CommentID, &comment.UserID, &comment.PostID, &comment.Content, &comment.Image); err != nil {
			tools.Log(err)
			return nil, err
		}
		comments = append(comments, comment)
	}
	return comments, nil
}

// Read a Comment by ID
func GetCommentByID(db *sql.DB, commentID string) (model.Comment, error) {
	querySQL := `SELECT comment_id, user_id, post_id, content FROM comments WHERE comment_id = ?;`
	var comment model.Comment
	err := db.QueryRow(querySQL, commentID).Scan(&comment.CommentID, &comment.UserID, &comment.PostID, &comment.Content, &comment.Image)
	if err != nil {
		tools.Log(err)
		return model.Comment{}, err
	}
	return comment, nil
}
