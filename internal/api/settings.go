package api

import (
	// "forum/internal/app"
	bd "forum/internal/database"
	repo "forum/internal/database/repository"
	model "forum/internal/models"
	"forum/internal/tools"
	"log"
	"net/http"
)

func SettingApi(w http.ResponseWriter, r *http.Request, sessionID string) {

	set := model.Set{}

	userID, err := repo.GetUserIDBySession(bd.GetDB(), sessionID)
	if err != nil {
		log.Print(err)
		response := map[string]string{"status": "error", "message": "Impossible de récupérer l'ID utilisateur à partir de la session"}
		tools.ResponseJSON(w, http.StatusInternalServerError, response)
		return
	}

	user, err := repo.GetUserByID(bd.GetDB(), userID)
	if err != nil {
		log.Print(err)
		response := map[string]string{"status": "error", "message": "Impossible de récupérer les informations de l'utilisateur"}
		tools.ResponseJSON(w, http.StatusInternalServerError, response)
		return
	}
	tmpUser := model.User{
		FirstName:    user.FirstName,
		Email:        user.Email,
		Photo:        user.Photo,
		StatusProfil: user.StatusProfil,
	}

	set.User = tmpUser

	tools.ResponseJSON(w, http.StatusOK, set)

}
