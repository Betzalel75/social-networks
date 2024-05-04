package handler

import (
	"database/sql"
	"fmt"
	bd "forum/pkg/db/sqlite"
	repo "forum/pkg/db/sqlite/repository"
	"forum/pkg/internal/app"
	model "forum/pkg/internal/models"
	"forum/pkg/tools"
	"net/http"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

/*----------------------------------------------------------------/
 ====================== AUTHENTIFICATION ========================
/----------------------------------------------------------------*/

func authentication(w http.ResponseWriter, r *http.Request, nameInput, password string) string {
	user := model.User{}
	var exist error
	name := strings.TrimSpace(nameInput)

	if strings.Contains(name, "@") {
		user, exist = repo.GetUserByEmail(bd.GetDB(), name)
	}

	if exist == sql.ErrNoRows {
		// Utilisateur non trouvé
		response := map[string]interface{}{
			"success": false,
			"message": "Email incorrect",
		}
		fmt.Println("Email incorrect")
		tools.Log(exist)
		tools.ResponseJSON(w, http.StatusUnauthorized, response)
		return ""
	}

	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)) == nil {
		// Authentification réussie
		// Supprimez les sessions existantes et définissez un nouveau cookie de session
		session, err := repo.GetSessionByUserI(bd.GetDB(), user.UserID)
		if err == nil {
			// tools.Log(err)
			repo.DeleteSession(bd.GetDB(), session.SessionID)
		}
		cookie := app.SetCookie(w, r, user.UserID)
		w.Header().Set("Set-Cookie", cookie.String())
		datas := returnData(r, cookie.Value)
		// Réponse JSON avec succès et redirection
		response := map[string]interface{}{
			"success":  true,
			"message":  "Authentication successful",
			"redirect": "/forum",
			"cookie":   cookie.Value,
			"datas":    datas,
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
	tools.ResponseJSON(w, http.StatusUnauthorized, response)
	return ""
}

func returnData(r *http.Request, cookie string) interface{} {
	var data interface{}

	if cookie != "" {

		userID, err := repo.GetUserIDBySession(bd.GetDB(), cookie)
		if err != nil {
			tools.Log(err)
			return nil
		}

		Id = userID

		filtre := r.URL.Query().Get("name")
		if filtre != "Event" && filtre != "General" && filtre != "Issue" && filtre != "Liked" {
			filtre = "all"
		}

		postsProfile, err := repo.GetPostsByCategoryAndUser(bd.GetDB(), filtre, userID)
		if err != nil {
			tools.Log(err)
		}
		if filtre == "Liked" {
			postsProfile, err = repo.GetLikedPostsByUser(bd.GetDB(), userID)
		}
		if err != nil {
			tools.Log(err)
			return nil
		}

		filtreForum := r.URL.Query().Get("name")
		if filtreForum != "Event" && filtreForum != "General" && filtreForum != "Issue" {
			filtreForum = "all"
		}

		posts, err := repo.GetPostsByCategoryName(bd.GetDB(), filtreForum)
		if err != nil {
			tools.Log(err)
			return nil
		}

		// Execution
		// structure pour tout prendre
		infoProfile := recoverPageInfo(postsProfile, cookie)
		info := recoverPageInfo(posts, cookie)

		// var tab [] model.Connection

		follow, err := repo.GetFollowedByUser(bd.GetDB(), userID)
		if err != nil {
			tools.Log(err)
		}
		// Filtrer les noms
		filteredUsers := filterNames(infoProfile.AllUser, follow)

		set := model.Set{}

		User, err := repo.GetUserByID(bd.GetDB(), userID)
		if err != nil {
			tools.Log(err)
		}
		tmpUser := model.User{
			FirstName: User.FirstName,
			Email:     User.Email,
			Photo:     User.Photo,
		}
		set.User = tmpUser

		data = model.DataStructure{
			IdUser:       userID,
			Publish:      info,
			PostsProfile: infoProfile,
			Sets:         set,
			Suggession:   filteredUsers,
		}

		return data

	}
	return nil
}
