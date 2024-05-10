package handler

import (
	"database/sql"
	bd "forum/pkg/db/sqlite"
	repo "forum/pkg/db/sqlite/repository"
	"forum/pkg/internal/app"
	model "forum/pkg/internal/models"
	"forum/pkg/tools"
	"net/http"
	"time"
)

func postGroup(w http.ResponseWriter, r *http.Request, dataContent model.Publications) {
	cookie, err := app.GetCookie(w, r)
	if err != nil {
		tools.Log(err)
		data := map[string]interface{}{
			"code":    http.StatusUnauthorized,
			"message": "Unauthorized",
		}
		tools.ResponseJSON(w, http.StatusUnauthorized, data)
		return
	}
	if app.IsConnected(w, r, cookie) {

		userID, err := repo.GetUserIDBySession(bd.GetDB(), cookie)
		if err != nil {
			tools.Log(err)
			tools.ResponseJSON(w, http.StatusInternalServerError, map[string]interface{}{"status": "error", "code": http.StatusInternalServerError, "message": "Internal Server Error"})
			return
		}
		user, err := repo.GetUserByID(bd.GetDB(), userID)
		if err != nil {
			tools.Log(err)
			tools.ResponseJSON(w, http.StatusInternalServerError, map[string]interface{}{"status": "error", "code": http.StatusInternalServerError, "message": "Internal Server Error"})
			return
		}
		private := false


		postID := tools.NeewId()
		post := model.Post{
			PostID:       postID,
			UserID:       user.UserID,
			GroupID:      dataContent.GroupID,
			Title:        dataContent.Title,
			Content:      dataContent.Desc,
			Photo:        user.Photo,
			Name:         user.FirstName,
			LikeCount:    0,
			DislikeCount: 0,
			CommentCount: 0,
			CreatedAt:    time.Now(),
			Private:      sql.NullBool{Valid: true, Bool: private}, // Default is false
		}

		like := model.Like{
			LikeID: tools.NeewId(),
			UserID: userID,
			PostID: postID,
			Type:   0,
		}

		err = repo.CreateLike(bd.GetDB(), like)
		if err != nil {
			tools.Log(err)
			tools.ResponseJSON(w, http.StatusInternalServerError, map[string]interface{}{"status": "error", "code": http.StatusInternalServerError, "message": "Internal Server Error"})
			return
		}

		if dataContent.Image.Name != "" {
			image, err := tools.UploadFile("post-"+postID, dataContent.Image)
			if err == nil {
				post.Image = image
			} else {
				tools.Log("message: " + image)
				response := map[string]interface{}{"status": "nosuccess", "message": image}
				tools.ResponseJSON(w, http.StatusOK, response)
				return
			}
		}

		err = repo.CreateGroupPost(bd.GetDB(), post)
		if err != nil {
			tools.Log(err)
			tools.ResponseJSON(w, http.StatusInternalServerError, map[string]interface{}{"status": "error", "code": http.StatusInternalServerError, "message": "Internal Server Error"})
			return
		}

		userIDs, err := repo.GetGroupMembers(bd.GetDB(), dataContent.GroupID) // Get all user IDs
		if err != nil {
			tools.Log(err)
		}
		if !private && err == nil {
			for _, id := range userIDs {
				// Add notification
				app.AddNotification(userID, id, "public", "post", dataContent.GroupID)
			}
		}

		// Créer la catégorie "all" pour le post
		categorie := model.Category{
			CategoryID: tools.NeewId(),
			PostID:     postID,
			Name:       "all",
		}
		err = repo.CreateCategory(bd.GetDB(), categorie)
		if err != nil {

			tools.Log(err)
			tools.ResponseJSON(w, http.StatusInternalServerError, map[string]interface{}{"status": "error", "code": http.StatusInternalServerError, "message": "Internal Server Error"})
			return
		}

		// Créer les autres catégories pour le post
		// r.ParseForm()
		for _, cat := range dataContent.Category {
			catID := tools.NeewId()
			categorie := model.Category{
				CategoryID: catID,
				PostID:     postID,
				Name:       cat,
			}
			err := repo.CreateCategory(bd.GetDB(), categorie)
			if err != nil {

				tools.Log(err)
				tools.ResponseJSON(w, http.StatusInternalServerError, map[string]interface{}{"status": "error", "code": http.StatusInternalServerError, "message": "Internal Server Error"})
				return
			}
		}

		// Récupérer tous les posts y compris le dernier
		posts, err := repo.GetGroupPostsByCategoryName(bd.GetDB(), "all")
		if err != nil {

			tools.Log(err)
			tools.ResponseJSON(w, http.StatusInternalServerError, map[string]interface{}{"status": "error", "code": http.StatusInternalServerError, "message": "Internal Server Error"})
			return
		}

		// Créer la structure de données pour la réponse JSON
		data := RecoverPageInfo(w, r, posts, dataContent.Cookie)
		datas := struct {
			PostID string
			Data   interface{}
		}{
			PostID: postID,
			Data:   data,
		}

		// Envoyer une réponse JSON
		response := map[string]interface{}{"status": "success", "message": datas}
		tools.ResponseJSON(w, http.StatusOK, response)
	} else {
		// Vous pouvez également envoyer une réponse JSON pour cette condition si nécessaire
		response := map[string]interface{}{"status": "error", "code": http.StatusUnauthorized, "message": "Unauthorized"}
		tools.ResponseJSON(w, http.StatusMethodNotAllowed, response)
	}
}
