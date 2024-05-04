package handler

import (
	bd "forum/pkg/db/sqlite"
	repo "forum/pkg/db/sqlite/repository"
	"forum/pkg/internal/app"
	model "forum/pkg/internal/models"
	"forum/pkg/tools"
	"net/http"
)

func setting(w http.ResponseWriter, r *http.Request, data model.Settings) {
	set := model.Set{}

	userID, err := repo.GetUserIDBySession(bd.GetDB(), data.Cookie)
	if err != nil {
		tools.Log(err)
		response := map[string]string{"status": "error", "message": "Impossible de récupérer l'ID utilisateur à partir de la session"}
		tools.ResponseJSON(w, http.StatusInternalServerError, response)
		return
	}
	var photo string

	user, err := repo.GetUserByID(bd.GetDB(), userID)
	if err != nil {
		tools.Log(err)
		response := map[string]string{"status": "error", "message": "Impossible de récupérer les informations de l'utilisateur"}
		tools.ResponseJSON(w, http.StatusInternalServerError, response)
		return
	}
	photo = user.Photo

	tmpUser := model.User{
		Username: user.FirstName,
		Email:    user.Email,
		Photo:    user.Photo,
	}
	set.User = tmpUser

	if r.Method == "POST" {
		newUser, message, status := app.UpdateUser(w, r, user, data)
		if status {
			set = model.Set{
				Status:  "success",
				Message: message,
				User:    newUser,
			}
			photo = newUser.Photo
		} else {
			set = model.Set{
				Status:  "nosuccess",
				Message: message,
				User:    tmpUser,
			}
		}
	} else {
		response := map[string]string{"status": "error", "message": "Méthode non autorisée"}
		tools.ResponseJSON(w, http.StatusMethodNotAllowed, response)
		return
	}

	// Envoyer une réponse JSON
	response := map[string]string{"status": set.Status, "message": set.Message, "photo": photo}
	if set.Status == "success" {
		tools.ResponseJSON(w, http.StatusOK, response)
	} else {
		tools.ResponseJSON(w, http.StatusOK, response)
	}
}
