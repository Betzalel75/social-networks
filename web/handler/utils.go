package handler

import (
	"forum/internal/app"
	bd "forum/internal/database"
	repo "forum/internal/database/repository"
	model "forum/internal/models"
	"forum/internal/tools"
	"net/http"
)

func allUsers(w http.ResponseWriter, cookie string) {
	if cookie == "" {
		tools.Log("cookie is empty")
		return
	}
	userID, _ := repo.GetUserIDBySession(bd.GetDB(), cookie)
	follow, err := repo.GetFollowedByUser(bd.GetDB(), userID)
	data := GetConnection(userID)
	if err != nil {
		tools.Log(err)
	}
	// Filtrer les noms
	users := filterNames(data, follow)

	tools.ResponseJSON(w, http.StatusOK, users)
}

// Route pour récupérer le contenu en fonction du nom de la section
func getSectionContent(w http.ResponseWriter, r *http.Request, cookie string) {
	if cookie == "" {
		tools.Log("cookie is empty")
		tools.ResponseJSON(w, http.StatusUnauthorized, nil)
		return
	}

	userID, err := repo.GetUserIDBySession(bd.GetDB(), cookie)
	if err != nil {
		tools.Log(err)
		tools.ResponseJSON(w, http.StatusUnauthorized, nil)
		return
	}

	content := datasProfil(w, r, userID)

	tools.ResponseJSON(w, http.StatusOK, content)
}

func checkStatus(w http.ResponseWriter, r *http.Request, cookie string) {
	if app.IsConnected(w, r, cookie) {
		data := returnData(r, cookie)
		tools.ResponseJSON(w, http.StatusOK, data)
	} else {
		tools.Debogage("Checking status failed")
		tools.ResponseJSON(w, http.StatusUnauthorized, nil)
	}
}

// Fonction pour vérifier si un nom est présent dans un tableau de structures
func isNamePresent(name string, users []model.Follow) bool {
	for _, user := range users {
		if user.FollowedUser == name {
			return true
		}
	}
	return false
}

// Fonction pour filtrer les noms
func filterNames(allUsers []model.Connection, follows []model.Follow) []model.Connection {
	var filteredUsers []model.Connection

	for _, user := range allUsers {
		if !isNamePresent(user.UserID, follows) {
			filteredUsers = append(filteredUsers, user)
		}
	}

	return filteredUsers
}

func members(userIDS []string) ([]model.Connection, error) {
	// Liste des utilisateurs WebSocket connectés
	clientsConnected := make(map[string]bool)
	for userID := range user_Client {
		clientsConnected[userID] = true
	}

	// Récupérer la liste complète des utilisateurs depuis la base de données
	users, err := getUsers(userIDS)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	var allUsers []model.Connection
	for _, user := range users {
		connect := model.Connection{
			UserID: user.UserID,
			Name:   user.Name,
			Photo:  user.Photo,
			Status: "offline",
		}

		allUsers = append(allUsers, connect)
	}

	// Mettre à jour le statut des utilisateurs en ligne
	for _, existingUser := range Array {
		for i := range allUsers {
			if allUsers[i].UserID == existingUser.Id {
				allUsers[i].Status = ""
			}
		}
	}
	return allUsers, nil
}

func getUsers(userIDS []string) ([]model.Connection, error) {
	// Récupérer la liste complète des utilisateurs depuis la base de données
	var tab []model.Connection
	for _, v := range userIDS {
		user, err := repo.GetUserByID(bd.GetDB(), v)
		if err != nil {
			tools.Log(err)
			return nil, err
		}
		// connect := model.Connection{}
		connect := model.Connection{
			UserID: user.UserID,
			Name:   user.FirstName,
			Photo:  user.Photo,
			Status: "offline",
		}

		tab = append(tab, connect)

	}
	return tab, nil
}

func allIDs(userID string) (userIDs []string) {
	// var userIDs []string
	allConnection := GetConnection(userID)
	for _, connection := range allConnection {
		userIDs = append(userIDs, connection.UserID)
	}
	return userIDs
}
