package main

import (
	"database/sql"
	model "forum/internal/models"
	"forum/internal/tools"
	"html"
)

func migrationUsers(sourceDB, destDB *sql.DB) {
	// Sélection des utilisateurs de la base de données source
	rows, err := sourceDB.Query("SELECT user_id, username, email, password, photo, age, gender, firstName, lastName FROM users;")
	if err != nil {
		panic(err)
	}
	defer rows.Close()

	// Boucle à travers les résultats et insertion dans la base de données de destination
	for rows.Next() {
		var u model.User
		if err := rows.Scan(&u.UserID, &u.Username, &u.Email, &u.Password, &u.Photo, &u.Age, &u.About, &u.FirstName, &u.LastName); err != nil {
			panic(err)
		}

		// Insertion de l'utilisateur dans la base de données de destination
		_, err := destDB.Exec("INSERT INTO users (user_id, username, email, password, photo, age, gender, firstName, lastName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);", u.UserID, html.EscapeString(u.Username), html.EscapeString(u.Email), html.EscapeString(u.Password), html.EscapeString(u.Photo), u.Age, html.EscapeString(u.About), html.EscapeString(u.FirstName), html.EscapeString(u.LastName))
		if err != nil {
			panic(err)
		}
	}

	// Vérification des erreurs éventuelles lors du parcours des lignes
	if err := rows.Err(); err != nil {
		panic(err)
	}

	tools.Debogage("Transfert d'utilisateurs terminé avec succès!")
}

func migrationMessages(sourceDB, destDB *sql.DB) {
	// Sélection des utilisateurs de la base de données source
	rows, err := sourceDB.Query("SELECT message_id, sender_id, receiver_id, content, sender_name, created_at, vu FROM messages")
	if err != nil {
		panic(err)
	}
	defer rows.Close()

	// Boucle à travers les résultats et insertion dans la base de données de destination
	for rows.Next() {
		var message model.Message
		if err := rows.Scan(&message.MessageID, &message.ReceiverID, &message.SenderID, &message.SenderName, &message.Content, &message.CreatedAt, &message.Vu); err != nil {
			panic(err)
		}

		// Insertion de l'utilisateur dans la base de données de destination
		_, err := destDB.Exec("INSERT INTO messages (message_id, sender_id, receiver_id, content, sender_name, created_at, vu) VALUES (?, ?, ?, ?, ?, ?, ?);", message.MessageID, message.SenderID, message.ReceiverID, html.EscapeString(message.Content), html.EscapeString(message.SenderName), message.CreatedAt, message.Vu)
		if err != nil {
			panic(err)
		}
	}

	// Vérification des erreurs éventuelles lors du parcours des lignes
	if err := rows.Err(); err != nil {
		panic(err)
	}

	tools.Debogage("Transfert des messages terminé avec succès!")
}

func migrationPosts(sourceDB, destDB *sql.DB) {
	// Sélection des utilisateurs de la base de données source
	rows, err := sourceDB.Query("SELECT post_id, user_id, title, content, image,likeCount, dislikeCount, commentCount,created_at FROM posts;")
	if err != nil {
		panic(err)
	}
	defer rows.Close()

	// Boucle à travers les résultats et insertion dans la base de données de destination
	for rows.Next() {
		var post model.Post
		if err := rows.Scan(&post.PostID, &post.UserID, &post.Title, &post.Content, &post.Image, &post.LikeCount, &post.DislikeCount, &post.CommentCount, &post.CreatedAt); err != nil {
			panic(err)
		}

		// Insertion de l'utilisateur dans la base de données de destination
		_, err := destDB.Exec("INSERT INTO posts (post_id, user_id, title, content, image,likeCount, dislikeCount, commentCount,created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);", post.PostID, post.UserID, html.EscapeString(post.Title), html.EscapeString(post.Content), html.EscapeString(post.Image), post.LikeCount, post.DislikeCount, post.CommentCount, post.CreatedAt)
		if err != nil {
			panic(err)
		}
	}

	// Vérification des erreurs éventuelles lors du parcours des lignes
	if err := rows.Err(); err != nil {
		panic(err)
	}

	tools.Debogage("Transfert des posts terminé avec succès!")
}

func migrationComment(sourceDB, destDB *sql.DB) {
	// Sélection des utilisateurs de la base de données source
	rows, err := sourceDB.Query("SELECT comment_id, user_id, post_id, content FROM comments;")
	if err != nil {
		panic(err)
	}
	defer rows.Close()

	// Boucle à travers les résultats et insertion dans la base de données de destination
	for rows.Next() {
		var comment model.Comment
		if err := rows.Scan(&comment.CommentID, &comment.UserID, &comment.PostID, &comment.Content); err != nil {
			panic(err)
		}

		// Insertion de l'utilisateur dans la base de données de destination
		_, err := destDB.Exec("INSERT INTO comments (comment_id, user_id, post_id, content) VALUES (?, ?, ?, ?);", comment.CommentID, comment.UserID, comment.PostID, html.EscapeString(comment.Content))
		if err != nil {
			panic(err)
		}
	}

	// Vérification des erreurs éventuelles lors du parcours des lignes
	if err := rows.Err(); err != nil {
		panic(err)
	}

	tools.Debogage("Transfert des commentaires terminé avec succès!")
}

func migrationLikes(sourceDB, destDB *sql.DB) {
	// Sélection des utilisateurs de la base de données source
	rows, err := sourceDB.Query("SELECT like_id, user_id, post_id, comment_id, type FROM likes;")
	if err != nil {
		panic(err)
	}
	defer rows.Close()

	// Boucle à travers les résultats et insertion dans la base de données de destination
	for rows.Next() {
		var like model.Like
		if err := rows.Scan(&like.LikeID, &like.UserID, &like.PostID, &like.CommentID, &like.Type); err != nil {
			panic(err)
		}

		// Insertion de l'utilisateur dans la base de données de destination
		_, err := destDB.Exec("INSERT INTO likes (like_id, user_id, post_id, comment_id, type) VALUES (?, ?, ?, ?, ?);", like.LikeID, like.UserID, like.PostID, like.CommentID, like.Type)
		if err != nil {
			panic(err)
		}
	}

	// Vérification des erreurs éventuelles lors du parcours des lignes
	if err := rows.Err(); err != nil {
		panic(err)
	}

	tools.Debogage("Transfert des likes terminé avec succès!")
}

func migrationCategory(sourceDB, destDB *sql.DB) {
	// Sélection des utilisateurs de la base de données source
	rows, err := sourceDB.Query("SELECT category_id,post_id, name FROM categories;")
	if err != nil {
		panic(err)
	}
	defer rows.Close()

	// Boucle à travers les résultats et insertion dans la base de données de destination
	for rows.Next() {
		var c model.Category
		if err := rows.Scan(&c.CategoryID, &c.PostID, &c.Name); err != nil {
			panic(err)
		}

		// Insertion de l'utilisateur dans la base de données de destination
		_, err := destDB.Exec("INSERT INTO categories (category_id, post_id, name) VALUES (?, ?, ?);", c.CategoryID, c.PostID, c.Name)
		if err != nil {
			panic(err)
		}
	}

	// Vérification des erreurs éventuelles lors du parcours des lignes
	if err := rows.Err(); err != nil {
		panic(err)
	}

	tools.Debogage("Transfert des likes terminé avec succès!")
}

func migrationAlreadyDone(destDB *sql.DB, table string) (bool, error) {
	// Préparation de la requête SQL pour vérifier l'existence de la table
	stmt, err := destDB.Prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?")
	if err != nil {
		return false, err
	}
	defer stmt.Close()

	// Exécution de la requête avec le nom de la table comme paramètre
	rows, err := stmt.Query(table)
	if err != nil {
		return false, err
	}
	defer rows.Close()

	// Vérification de l'existence de la table
	if rows.Next() {
		// La table existe, vérifions maintenant si elle est vide
		countStmt, err := destDB.Prepare("SELECT COUNT(*) FROM " + table)
		if err != nil {
			return false, err
		}
		defer countStmt.Close()

		var count int
		err = countStmt.QueryRow().Scan(&count)
		if err != nil {
			return false, err
		}

		// Si le nombre de lignes est supérieur à 0, la table n'est pas vide
		if count > 0 {
			return true, nil // La table existe et n'est pas vide
		}
	}

	// La table n'existe pas ou est vide
	return false, nil
}
