package handler

import (
	"encoding/json"
	bd "forum/pkg/db/sqlite"
	repo "forum/pkg/db/sqlite/repository"
	"forum/pkg/internal/app"
	model "forum/pkg/internal/models"
	"forum/pkg/tools"
	"net/http"
)

func comment(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
	if r.Method == "POST" {
		var commentMessage model.CommentMessage
		if err := json.NewDecoder(r.Body).Decode(&commentMessage); err != nil {
			tools.Log(err)
			data := map[string]interface{}{
				"code":    http.StatusInternalServerError,
				"message": "Internal Server Error",
			}
			tools.ResponseJSON(w, http.StatusInternalServerError, data)
			return
		}
		// Utilisez les valeurs désérialisées
		postID := commentMessage.PostID
		commentContent := commentMessage.Comment
		submit := commentMessage.Submit
		senderId := commentMessage.SenderID
		photo := commentMessage.Image
		image := ""
		// Sauvegarde des commentaires avec le client WebSocket dans la base de données
		commentId := tools.NeewId()
		if photo.Name != "" {
			img, err := tools.UploadFile("comment-"+commentId, photo)
			if err != nil {
				tools.Log(err)
				return
			}
			// Utilisez le nom de fichier retourné s'il y a eu un téléchargement réussi
			image = img
		}
		app.AddComment(postID, commentContent, submit, senderId, commentId, image)
		post, err := repo.GetPostByID(bd.GetDB(), postID)
		if err != nil {
			tools.Log(err)
			data := map[string]interface{}{
				"code":    http.StatusInternalServerError,
				"message": "Internal Server Error",
			}
			tools.ResponseJSON(w, http.StatusInternalServerError, data)
			return
		}
		comment := app.CommentsToPost(bd.GetDB(), post)
		data := map[string]interface{}{
			"count":    len(comment),
			"comments": comment,
		}
		tools.ResponseJSON(w, http.StatusOK, data)

	} else {
		data := map[string]interface{}{
			"code":    http.StatusMethodNotAllowed,
			"message": "Method Not Allowed",
		}
		tools.Log(r.Method)
		tools.ResponseJSON(w, http.StatusMethodNotAllowed, data)
	}
}

// Get all comments for a post by post ID
func getComments(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
	var commentMessage model.Credentials
	if err := json.NewDecoder(r.Body).Decode(&commentMessage); err != nil {
		tools.Log(err)
		data := map[string]interface{}{
			"code":    http.StatusInternalServerError,
			"message": "Internal Server Error",
		}
		tools.ResponseJSON(w, http.StatusInternalServerError, data)
		return
	}
	var post model.Post
	post, err := repo.GetPostByID(bd.GetDB(), commentMessage.Identifiant)
	if err != nil {
		post, err = repo.GetGroupPostByID(bd.GetDB(), commentMessage.Identifiant)
		if err != nil {
			tools.Log(err)
			data := map[string]interface{}{
				"code":    http.StatusInternalServerError,
				"message": "Internal Server Error",
			}
			tools.ResponseJSON(w, http.StatusInternalServerError, data)
			return
		}
	}
	comment := app.CommentsToPost(bd.GetDB(), post)
	data := map[string]interface{}{
		"count":    len(comment),
		"comments": comment,
	}
	tools.ResponseJSON(w, http.StatusOK, data)
}
