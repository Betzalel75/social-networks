package repo

import (
	"database/sql"
	model "forum/pkg/internal/models"
	"forum/pkg/tools"
	"html"
	"time"
)

// Create a new Post
func CreatePost(db *sql.DB, post model.Post) error {
	stmt, err := db.Prepare("INSERT INTO posts (post_id, user_id, title, content, image,likeCount, dislikeCount, commentCount,created_at,private) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?);")

	if err != nil {
		tools.Log(err)
		return err
	}
	defer stmt.Close()
	post.CreatedAt = time.Now()
	_, err = stmt.Exec(post.PostID, post.UserID, html.EscapeString(post.Title), html.EscapeString(post.Content), html.EscapeString(post.Image), post.LikeCount, post.DislikeCount, post.CommentCount, post.CreatedAt, post.Private)

	return err
}

// Read all Posts
func GetPosts(db *sql.DB) ([]model.Post, error) {
	querySQL := `SELECT post_id, title, content, image,likeCount, dislikeCount, commentCount, created_at, private FROM posts;`
	rows, err := db.Query(querySQL)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()

	var posts []model.Post
	for rows.Next() {
		var post model.Post
		if err := rows.Scan(&post.PostID, &post.Title, &post.Content, &post.Image, &post.LikeCount, &post.DislikeCount, &post.CommentCount, &post.CreatedAt, &post.Private); err != nil {
			tools.Log(err)
			return nil, err
		}
		posts = append(posts, post)
	}

	return posts, nil
}

// Read a Post by ID
func GetPostByID(db *sql.DB, postID string) (model.Post, error) {
	querySQL := `SELECT post_id, user_id, title, content, image,likeCount, dislikeCount, commentCount, created_at FROM posts WHERE post_id = ?;`
	var post model.Post
	err := db.QueryRow(querySQL, postID).Scan(&post.PostID, &post.UserID, &post.Title, &post.Content, &post.Image, &post.LikeCount, &post.DislikeCount, &post.CommentCount, &post.CreatedAt)
	if err != nil {
		tools.Log(err)
		return model.Post{}, err
	}
	return post, nil
}

// Read all Posts
func GetPostsByUser(db *sql.DB, userID string) ([]model.Post, error) {
	querySQL := `SELECT post_id, user_id, title, content, image,likeCount, dislikeCount, commentCount, created_at FROM posts WHERE user_id= ?;`
	rows, err := db.Query(querySQL, userID)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()

	var posts []model.Post
	for rows.Next() {
		var post model.Post
		if err := rows.Scan(&post.PostID, &post.UserID, &post.Title, &post.Content, &post.Image, &post.LikeCount, &post.DislikeCount, &post.CommentCount, &post.CreatedAt); err != nil {
			tools.Log(err)
			return nil, err
		}
		posts = append(posts, post)
	}
	return posts, nil
}

// GetPostsByCategoryAndUser retrieves posts with a specific category for a given user.
func GetPostsByCategoryName(db *sql.DB, categoryName string) ([]model.Post, error) {
	querySQL := `
		SELECT p.post_id, p.user_id, p.title, p.content, p.image, p.likeCount, p.dislikeCount, p.commentCount, p.created_at
		FROM posts p
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
			&p.PostID, &p.UserID, &p.Title, &p.Content, &p.Image,
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
func GetPostsByCategoryAndUser(db *sql.DB, categoryName string, userID string) ([]model.Post, error) {
	querySQL := `
		SELECT p.post_id, p.user_id, p.title, p.content, p.image, p.likeCount, p.dislikeCount, p.commentCount, p.created_at
		FROM posts p
		JOIN categories c ON (p.post_id = c.post_id)
		WHERE (c.name = ? AND p.user_id = ?)
		ORDER BY p.created_at DESC;
	`
	rows, err := db.Query(querySQL, categoryName, userID)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()
	var posts []model.Post
	for rows.Next() {
		var p model.Post
		if err := rows.Scan(
			&p.PostID, &p.UserID, &p.Title, &p.Content, &p.Image,
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
func GetLikedPostsByUser(db *sql.DB, userID string) ([]model.Post, error) {
	querySQL := `
		SELECT p.post_id, p.user_id, p.title, p.content, p.image, p.likeCount, p.dislikeCount, p.commentCount, p.created_at
		FROM posts p
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
			&p.PostID, &p.UserID, &p.Title, &p.Content, &p.Image,
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
================== GET ALL POST ACCESS AGREE =====================
/----------------------------------------------------------------*/

// GetAllPostsAccessibleByUser récupère tous les posts accessibles par un utilisateur à travers ses clés, y compris les clés partagées.
func GetAllPostsAccessibleByUser(db *sql.DB, userID string) ([]model.Post, error) {
	// Préparation de la requête SQL avec une jointure entre les tables posts, keys et user_key
	query := `
			SELECT p.post_id, p.user_id, p.title, p.content, p.image, p.likeCount, p.dislikeCount, p.commentCount, p.created_at, p.private
			FROM posts p
			INNER JOIN keys k ON p.post_id = k.key
			INNER JOIN user_key uk ON k.key_id = uk.key_id
			WHERE uk.user_id = ? OR k.user_id = ?;
	`
	stmt, err := db.Prepare(query)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer stmt.Close()

	// Exécution de la requête et récupération des résultats
	rows, err := stmt.Query(userID, userID)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()

	var posts []model.Post
	// Parcourir les lignes résultantes
	for rows.Next() {
		var post model.Post
		err := rows.Scan(&post.PostID, &post.UserID, &post.Title, &post.Content, &post.Image, &post.LikeCount, &post.DislikeCount, &post.CommentCount, &post.CreatedAt, &post.Private)
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

/*----------------------------------------------------------------/
	==================== GET ALL POSTS PUBLIC ======================
/----------------------------------------------------------------*/

// GetAllPostsAccessibleByUser récupère tous les posts accessibles par un utilisateur à travers ses clés, y compris les clés partagées.
func GetAllPostsPublic(db *sql.DB) ([]model.Post, error) {
	// Préparation de la requête SQL avec une jointure entre les tables posts, keys et user_key
	query := `
			SELECT p.post_id, p.user_id, p.title, p.content, p.image, p.likeCount, p.dislikeCount, p.commentCount, p.created_at, p.private
			FROM posts p WHERE p.private = false;
	`
	stmt, err := db.Prepare(query)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer stmt.Close()

	// Exécution de la requête et récupération des résultats
	rows, err := stmt.Query()
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()

	var posts []model.Post
	// Parcourir les lignes résultantes
	for rows.Next() {
		var post model.Post
		err := rows.Scan(&post.PostID, &post.UserID, &post.Title, &post.Content, &post.Image, &post.LikeCount, &post.DislikeCount, &post.CommentCount, &post.CreatedAt, &post.Private)
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
======= GET ALL POST TO SPECIFIC USER WITH ACESS KEYS ============
/----------------------------------------------------------------
*/
func GetPostsByKeysCategoryAndUser(db *sql.DB, categoryName string, userID string, visitorID string) ([]model.Post, error) {
	querySQL := `
	SELECT p.post_id, p.user_id, p.title, p.content, p.image, p.likeCount, p.dislikeCount, p.commentCount, p.created_at
	FROM posts p
	JOIN categories c ON (p.post_id = c.post_id)
	JOIN keys k ON (p.post_id = k.key)
	JOIN user_key uk ON (k.key_id = uk.key_id)
	WHERE (c.name = ? AND p.user_id = ?)
			AND uk.user_id = ?
	ORDER BY p.created_at DESC;
	`
	rows, err := db.Query(querySQL, categoryName, userID, visitorID)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()
	var posts []model.Post
	for rows.Next() {
		var p model.Post
		if err := rows.Scan(
			&p.PostID, &p.UserID, &p.Title, &p.Content, &p.Image,
			&p.LikeCount, &p.DislikeCount, &p.CommentCount, &p.CreatedAt,
		); err != nil {
			tools.Log(err)
			return nil, err
		}
		posts = append(posts, p)
	}
	return posts, nil
}

/*
----------------------------------------------------------------/
============ GET ALL POST PUBLIC TO SPECIFIC USER  ============
/----------------------------------------------------------------
*/
func GetPostsPublicCategoryAndUser(db *sql.DB, categoryName string, visitedtID string) ([]model.Post, error) {
	querySQL := `
	SELECT p.post_id, p.user_id, p.title, p.content, p.image, p.likeCount, p.dislikeCount, p.commentCount, p.created_at
	FROM posts p
	JOIN categories c ON (p.post_id = c.post_id)
	WHERE (c.name = ? AND p.user_id = ?)
			AND (p.private = false)
	ORDER BY p.created_at DESC;
	`
	rows, err := db.Query(querySQL, categoryName, visitedtID)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()
	var posts []model.Post
	for rows.Next() {
		var p model.Post
		if err := rows.Scan(
			&p.PostID, &p.UserID, &p.Title, &p.Content, &p.Image,
			&p.LikeCount, &p.DislikeCount, &p.CommentCount, &p.CreatedAt,
		); err != nil {
			tools.Log(err)
			return nil, err
		}
		posts = append(posts, p)
	}
	return posts, nil
}
