package app

import (
	"database/sql"
	"encoding/json"
	"fmt"

	"net/http"
	"strings"

	bd "forum/internal/database"
	repo "forum/internal/database/repository"
	model "forum/internal/models"
	"forum/internal/tools"

	"golang.org/x/crypto/bcrypt"
)


// Authentication gère le processus d'authentification.
func Authentication(w http.ResponseWriter, r *http.Request, nameInput, password string) string {
	user := model.User{}
	var exist error
	name := strings.TrimSpace(nameInput)

	if strings.Contains(name, "@") {
		user, exist = repo.GetUserByEmail(bd.GetDB(), name)
	} else {
		user, exist = repo.GetUserByNickName(bd.GetDB(), name)
	}

	if exist == sql.ErrNoRows {
		// Utilisateur non trouvé
		response := map[string]interface{}{
			"success": false,
			"message": "Email incorrect",
		}
		fmt.Println("Email incorrect")
		sendJSONResponse(w, response, http.StatusUnauthorized)
		return "Email incorrect"
	}

	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)) == nil {
		// Authentification réussie
		// Supprimez les sessions existantes et définissez un nouveau cookie de session
		session, err := repo.GetSessionByUserI(bd.GetDB(), user.UserID)
		if err == nil {
			repo.DeleteSession(bd.GetDB(), session.SessionID)
		}
		cookie := SetCookie(w, r, user.UserID)
		

		// Réponse JSON avec succès et redirection
		response := map[string]interface{}{
			"success":  true,
			"message":  "Authentication successful",
			"redirect": "/?name=all",
			"cookie":   cookie,
		}
		fmt.Println("Authentication successful")
		// sendJSONResponse(w, response, http.StatusOK)
		tools.ResponseJSON(w, http.StatusAccepted, response)
		return user.UserID
	}

	// Mot de passe incorrect
	response := map[string]interface{}{
		"success": false,
		"message": "Password incorrect",
	}
	fmt.Println("Password incorrect")
	sendJSONResponse(w, response, http.StatusUnauthorized)
	return "Password incorrect"
}

// sendJSONResponse envoie une réponse JSON avec le code d'état HTTP spécifié.
func sendJSONResponse(w http.ResponseWriter, data interface{}, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}

// sign Un


func passwordCrypt(password string) (string, error) {
	pwd, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		tools.LogErr(err)
		tools.Log(err)
	}
	return string(pwd), nil
}
