package repo

import (
	"database/sql"
	model "forum/internal/models"
	"forum/internal/tools"
	"html"
	"time"
)

// Create a new Post
func CreateGroupPost(db *sql.DB, post model.Post) error {
	stmt, err := db.Prepare("INSERT INTO group_posts (post_id, group_id, user_id, title, content, image,likeCount, dislikeCount, commentCount,created_at,private) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?);")

	if err != nil {
		tools.Log(err)
		return err
	}
	defer stmt.Close()
	post.CreatedAt = time.Now()
	_, err = stmt.Exec(post.PostID, post.GroupID, post.UserID, html.EscapeString(post.Title), html.EscapeString(post.Content), html.EscapeString(post.Image), post.LikeCount, post.DislikeCount, post.CommentCount, post.CreatedAt, post.Private)

	return err
}

// Read all Posts
func GetGroupPosts(db *sql.DB) ([]model.Post, error) {
	querySQL := `SELECT post_id, group_id, title, content, image,likeCount, dislikeCount, commentCount, created_at, private FROM group_posts;`
	rows, err := db.Query(querySQL)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()

	var posts []model.Post
	for rows.Next() {
		var post model.Post
		if err := rows.Scan(&post.PostID, &post.GroupID, &post.Title, &post.Content, &post.Image, &post.LikeCount, &post.DislikeCount, &post.CommentCount, &post.CreatedAt, &post.Private); err != nil {
			tools.Log(err)
			return nil, err
		}
		posts = append(posts, post)
	}

	return posts, nil
}

// Read a Post by ID
func GetGroupPostByID(db *sql.DB, postID string) (model.Post, error) {
	querySQL := `SELECT post_id, group_id, user_id, title, content, image,likeCount, dislikeCount, commentCount, created_at FROM group_posts WHERE post_id = ?;`
	var post model.Post
	err := db.QueryRow(querySQL, postID).Scan(&post.PostID, &post.GroupID, &post.UserID, &post.Title, &post.Content, &post.Image, &post.LikeCount, &post.DislikeCount, &post.CommentCount, &post.CreatedAt)
	if err != nil {
		tools.Log(err)
		return model.Post{}, err
	}
	return post, nil
}

// Read all Posts
func GetGroupPostsByUser(db *sql.DB, userID string) ([]model.Post, error) {
	querySQL := `SELECT post_id, group_id, user_id, title, content, image,likeCount, dislikeCount, commentCount, created_at FROM group_posts WHERE user_id= ?;`
	rows, err := db.Query(querySQL, userID)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()

	var posts []model.Post
	for rows.Next() {
		var post model.Post
		if err := rows.Scan(&post.PostID, &post.GroupID, &post.UserID, &post.Title, &post.Content, &post.Image, &post.LikeCount, &post.DislikeCount, &post.CommentCount, &post.CreatedAt); err != nil {
			tools.Log(err)
			return nil, err
		}
		posts = append(posts, post)
	}
	return posts, nil
}

// GetPostsByCategoryAndUser retrieves posts with a specific category for a given user.
func GetGroupPostsByCategoryName(db *sql.DB, categoryName string) ([]model.Post, error) {
	querySQL := `
		SELECT p.post_id, p.group_id, p.user_id, p.title, p.content, p.image, p.likeCount, p.dislikeCount, p.commentCount, p.created_at
		FROM group_posts p
		JOIN categories c ON (p.post_id = c.post_id)
		WHERE (c.name = ?)
		ORDER BY p.created_at DESC;
	`
	rows, err := db.Query(querySQL, categoryName)
	if err != nil {
		tools.LogErr(err)
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()
	var posts []model.Post
	for rows.Next() {
		var p model.Post
		if err := rows.Scan(
			&p.PostID, &p.GroupID, &p.UserID, &p.Title, &p.Content, &p.Image,
			&p.LikeCount, &p.DislikeCount, &p.CommentCount, &p.CreatedAt,
		); err != nil {
			tools.Log(err)
			return nil, err
		}
		posts = append(posts, p)
	}
	return posts, nil
}

// GetPostsByCategoryAndUser retrieves posts with a specific category for a given user.
func GetGroupPostsByCategoryAndUser(db *sql.DB, categoryName string, groupID string) ([]model.Post, error) {
	querySQL := `
		SELECT p.post_id, p.group_id, p.user_id, p.title, p.content, p.image, p.likeCount, p.dislikeCount, p.commentCount, p.created_at
		FROM group_posts p
		JOIN categories c ON (p.post_id = c.post_id)
		WHERE (c.name = ? AND p.group_id = ?)
		ORDER BY p.created_at DESC;
	`
	rows, err := db.Query(querySQL, categoryName, groupID)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()
	var posts []model.Post
	for rows.Next() {
		var p model.Post
		if err := rows.Scan(
			&p.PostID, &p.GroupID, &p.UserID, &p.Title, &p.Content, &p.Image,
			&p.LikeCount, &p.DislikeCount, &p.CommentCount, &p.CreatedAt,
		); err != nil {
			tools.Log(err)
			return nil, err
		}
		posts = append(posts, p)
	}
	return posts, nil
}

// GetLikedPostsByUser retrieves posts liked by a specific user.
func GetLikedGroupPostsByUser(db *sql.DB, userID string) ([]model.Post, error) {
	querySQL := `
		SELECT p.post_id, p.group_id, p.user_id, p.title, p.content, p.image, p.likeCount, p.dislikeCount, p.commentCount, p.created_at
		FROM group_posts p
		JOIN likes l ON p.post_id = l.post_id
		WHERE (l.user_id = ? AND l.type =1)
		ORDER BY p.created_at DESC;
	`
	rows, err := db.Query(querySQL, userID)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()
	var posts []model.Post
	for rows.Next() {
		var p model.Post
		if err := rows.Scan(
			&p.PostID, &p.GroupID, &p.UserID, &p.Title, &p.Content, &p.Image,
			&p.LikeCount, &p.DislikeCount, &p.CommentCount, &p.CreatedAt,
		); err != nil {
			tools.Log(err)
			return nil, err
		}
		posts = append(posts, p)
	}
	return posts, nil
}

/*----------------------------------------------------------------/
	==================== GET ALL POSTS PUBLIC ======================
/----------------------------------------------------------------*/

// GetAllPostsAccessibleByUser récupère tous les posts accessibles par un utilisateur à travers ses clés, y compris les clés partagées.
func GetAllGroupPostsPublic(db *sql.DB, groupID string) ([]model.Post, error) {
	query := `
		SELECT p.post_id, p.group_id ,p.user_id, p.title, p.content, p.image, p.likeCount, p.dislikeCount, p.commentCount, p.created_at, p.private
		FROM group_posts p WHERE (p.private = false) AND p.group_id = ?;
	`
	stmt, err := db.Prepare(query)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer func() {
		if cerr := stmt.Close(); cerr != nil && err == nil {
			err = cerr
		}
	}()

	rows, err := stmt.Query(groupID)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer func() {
		if cerr := rows.Close(); cerr != nil && err == nil {
			err = cerr
		}
	}()

	var posts []model.Post
	for rows.Next() {
		var post model.Post
		err := rows.Scan(&post.PostID, &post.GroupID, &post.UserID, &post.Title, &post.Content, &post.Image, &post.LikeCount, &post.DislikeCount, &post.CommentCount, &post.CreatedAt, &post.Private)
		if err != nil {
			tools.Log(err)
			return nil, err
		}
		posts = append(posts, post)
	}

	if err := rows.Err(); err != nil {
		tools.Log(err)
		return nil, err
	}

	return posts, nil
}

/*
----------------------------------------------------------------/

	========== GET ALL POST PUBLIC TO SPECIFIC USER  ============

/----------------------------------------------------------------
*/
func GetGroupPostsPublicCategoryAndUser(db *sql.DB, categoryName, groupID, visitedtID string) ([]model.Post, error) {
	querySQL := `
	SELECT p.post_id, p.group_id, p.user_id, p.title, p.content, p.image, p.likeCount, p.dislikeCount, p.commentCount, p.created_at
	FROM group_posts p
	JOIN categories c ON (p.post_id = c.post_id)
	WHERE (c.name = ? AND p.user_id = ? AND p.group_id = ?)
		AND (p.private = false)
	ORDER BY p.created_at DESC;
	`
	rows, err := db.Query(querySQL, categoryName, visitedtID, groupID)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()
	var posts []model.Post
	for rows.Next() {
		var p model.Post
		if err := rows.Scan(
			&p.PostID, &p.GroupID, &p.UserID, &p.Title, &p.Content, &p.Image,
			&p.LikeCount, &p.DislikeCount, &p.CommentCount, &p.CreatedAt,
		); err != nil {
			tools.Log(err)
			return nil, err
		}
		posts = append(posts, p)
	}
	if err = rows.Err(); err != nil {
		tools.Log(err)
		return nil, err
	}
	return posts, nil
}
