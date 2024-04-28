package handler

import (
	"database/sql"
	"encoding/json"
	"forum/internal/app"
	bd "forum/internal/database"
	repo "forum/internal/database/repository"
	model "forum/internal/models"
	"forum/internal/tools"
	"net/http"
)

func RecoverPageInfo(w http.ResponseWriter, r *http.Request, posts []model.Post, cookie string) model.PageInfo {
	var connected = true
	userID, err := repo.GetUserIDBySession(bd.GetDB(), cookie)
	if err != nil {
		if err == sql.ErrNoRows {
			connected = false
		}
	}
	user, err := repo.GetUserByID(bd.GetDB(), userID)
	if err != nil {
		connected = false
	}
	// Ajout des messages
	pageinfo := model.PageInfo{
		Name:      user.FirstName,
		Photo:     user.Photo,
		Posts:     app.InitPostAndCommentLikeAndDislike(posts),
		AllUser:   GetConnection(userID),
		Connected: connected,
	}
	return pageinfo
}

func recoverPageInfo(posts []model.Post, cookie string) model.PageInfo {
	var connected = false

	if cookie != "" {
		connected = true
	}
	userID, err := repo.GetUserIDBySession(bd.GetDB(), cookie)
	if err != nil {
		tools.Log(err)
		if err == sql.ErrNoRows {
			connected = false
		}
	}
	user, err := repo.GetUserByID(bd.GetDB(), userID)
	if err != nil {
		tools.Log(err)
		connected = false
	}

	pageinfo := model.PageInfo{
		Name:      user.FirstName,
		Photo:     user.Photo,
		Posts:     app.InitPostAndCommentLikeAndDislike(posts),
		AllUser:   GetConnection(userID),
		Connected: connected,
	}
	return pageinfo
}

func updateStatusHandler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {

	var credentials model.Credentials
	// Décodage du JSON à partir du tableau de bytes
	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		tools.Log(err)
		data := map[string]interface{}{
			"code":    http.StatusInternalServerError,
			"message": "Internal Server Error",
		}
		tools.ResponseJSON(w, http.StatusInternalServerError, data)
		return
	}

	cookie, err := app.GetCookie(w, r)
	if err != nil {
		tools.Log(err)
		data := map[string]interface{}{
			"code":    http.StatusInternalServerError,
			"message": "Internal Server Error",
		}
		tools.ResponseJSON(w, http.StatusInternalServerError, data)
		return
	}

	if app.IsConnected(w, r, cookie) {
		userID, err := repo.GetUserIDBySession(bd.GetDB(), cookie)
		if err != nil {
			tools.Log(err)
			data := map[string]interface{}{
				"code":    http.StatusInternalServerError,
				"message": "Internal Server Error",
			}
			tools.ResponseJSON(w, http.StatusInternalServerError, data)
			return
		}

		err = repo.UpdateStatus(bd.GetDB(), userID, credentials.Identifiant)
		if err != nil {
			tools.Log(err)
			data := map[string]interface{}{
				"code":    http.StatusInternalServerError,
				"message": "Internal Server Error",
			}
			tools.ResponseJSON(w, http.StatusInternalServerError, data)
			return
		}
		data := map[string]interface{}{
			"status": credentials.Identifiant,
		}
		tools.ResponseJSON(w, http.StatusOK, data)
	}
}
