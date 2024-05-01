package handler

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"forum/internal/api"
	"forum/internal/app"
	bd "forum/internal/database"
	repo "forum/internal/database/repository"
	model "forum/internal/models"
	"forum/internal/tools"
	"log"
	"net/http"
	"sort"
	"strconv"
	"text/template"
	"time"
	// "github.com/gorilla/mux"
)

// declancherles erreurs
func StatusError(w http.ResponseWriter, r *http.Request, code int, message string) {
	err := model.Erreur{
		Code: code, Message: message}
	tools.ResponseJSON(w, code, err)
}

var (
	ProfileData model.PageInfo
	Id          string
)

func forum(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
	tmpl, err := template.ParseFiles("./web/template/one.html")
	if err != nil {
		tools.Log(err)
		tools.ResponseJSON(w, http.StatusInternalServerError, nil)
		return
	}
	handleSignUp(w, tmpl)
}

// Fonction pour gérer l'inscription
func handleSignUp(w http.ResponseWriter, tmpl *template.Template) {
	// Partie sign in and up
	message, status := "", ""

	infolog := model.Loginfo{
		Status:  status,
		Message: message,
	}

	data := model.DataStructure{
		Infolog: infolog,
	}
	if message != "" {
		w.WriteHeader(http.StatusUnauthorized)
	}
	err := tmpl.Execute(w, data)
	if err != nil {

		tools.Log(err)
		return
	}
}

func datasProfil(w http.ResponseWriter, r *http.Request, visitedID string) interface{} {
	cookie, _ := app.GetCookie(w, r)
	visitorID, err := repo.GetUserIDBySession(bd.GetDB(), cookie)
	if err != nil {
		tools.Log(err)
		return model.PageInfo{}
	}
	filtre := r.URL.Query().Get("name")
	if filtre != "Event" && filtre != "General" && filtre != "Issue" && filtre != "Liked" {
		filtre = "all"
	}
	var posts []model.Post
	if visitedID != visitorID {
		isFollw := false

		// Verifier s'il fait partie des followers
		followedTab, err := repo.GetFollowersByUser(bd.GetDB(), visitedID)
		if err != nil {
			tools.Log(err)
			return model.PageInfo{}
		}

		for _, v := range followedTab {
			if v.UserID == visitorID {
				isFollw = true
				break
			}
		}
		fmt.Println("isfollow:", isFollw)

		if isFollw {
			posts, err = repo.GetPostsByKeysCategoryAndUser(bd.GetDB(), filtre, visitedID, visitorID)
			if err != nil {
				tools.Log(err)
				return model.PageInfo{}
			}

			if filtre == "Liked" {
				posts, err = repo.GetLikedPostsByUser(bd.GetDB(), visitedID)
				if err != nil {
					tools.Log(err)
					return model.PageInfo{}
				}
			}
			// Post public
			postsPublic, err := repo.GetPostsPublicCategoryAndUser(bd.GetDB(), filtre, visitedID)
			if err != nil {
				tools.Log(err)
				return model.PageInfo{}
			}

			if filtre == "Liked" {
				postsPublic, err = repo.GetLikedPostsByUser(bd.GetDB(), visitedID)
				if err != nil {
					tools.Log(err)
					return model.PageInfo{}
				}
			}
			posts = append(posts, postsPublic...)
			// Tri des posts dans l'ordre décroissant
			sort.Sort(CustomSortByDate(posts))
		} else {
			// verifier si le profile est public
			usr, err := repo.GetUserByID(bd.GetDB(), visitedID)
			if err != nil {
				tools.Log(err)
				return model.PageInfo{}
			}
			if usr.StatusProfil == "public" {
				posts, err = repo.GetPostsByKeysCategoryAndUser(bd.GetDB(), filtre, visitedID, visitorID)
				if err != nil {
					tools.Log(err)
					return model.PageInfo{}
				}

				if filtre == "Liked" {
					posts, err = repo.GetLikedPostsByUser(bd.GetDB(), visitedID)
					if err != nil {
						tools.Log(err)
						return model.PageInfo{}
					}
				}
				// Post public
				postsPublic, err := repo.GetPostsPublicCategoryAndUser(bd.GetDB(), filtre, visitedID)
				if err != nil {
					tools.Log(err)
					return model.PageInfo{}
				}

				if filtre == "Liked" {
					postsPublic, err = repo.GetLikedPostsByUser(bd.GetDB(), visitedID)
					if err != nil {
						tools.Log(err)
						return model.PageInfo{}
					}
				}
				posts = append(posts, postsPublic...)
				// Tri des posts dans l'ordre décroissant
				sort.Sort(CustomSortByDate(posts))
			} else {
				data := map[string]interface{}{
					"account":     "private",
					"publication": model.PageInfo{},
				}
				return data
			}
		}
	} else {
		posts, err = repo.GetPostsByCategoryAndUser(bd.GetDB(), filtre, visitedID)
		if filtre == "Liked" {
			posts, err = repo.GetLikedPostsByUser(bd.GetDB(), visitedID)
		}
		if err != nil {
			tools.Log(err)
			return model.PageInfo{}
		}
	}
	user, err := repo.GetUserByID(bd.GetDB(), visitedID)
	if err != nil {
		tools.Log(err)
		return model.PageInfo{}
	}
	var infoUser model.User
	infoUser.FirstName = user.FirstName
	infoUser.Email = user.Email
	infoUser.About = user.About
	infoUser.Username = user.Username
	infoUser.LastName = user.LastName
	infoUser.StatusProfil = user.StatusProfil
	infoUser.Age = user.Age // Birth date
	// fmt.Println("infoUser:", infoUser)

	// app.InitPostAndCommentLikeAndDislike(posts)
	response := map[string]interface{}{
		"success":     true,
		"publication": app.InitPostAndCommentLikeAndDislike(posts),
		"user":        infoUser,
		"status":      user.StatusProfil,
	}
	return response
}

func dataForum(userID string) interface{} {
	var tab []model.Post
	postsAuthorized, err := repo.GetAllPostsAccessibleByUser(bd.GetDB(), userID)
	if err != nil {
		tools.Log(err)
		return model.PageInfo{}
	}
	postPublic, _ := repo.GetAllPostsPublic(bd.GetDB())

	tab = append(tab, postsAuthorized...)
	tab = append(tab, postPublic...)
	// Tri des posts dans l'ordre décroissant
	sort.Sort(CustomSortByDate(tab))
	response := map[string]interface{}{
		"success":     true,
		"publication": app.InitPostAndCommentLikeAndDislike(tab),
	}

	return response
}

func allPost(w http.ResponseWriter, cookie string) {
	userID, _ := repo.GetUserIDBySession(bd.GetDB(), cookie)
	content := dataForum(userID)
	allU := GetConnection(userID)
	follow, err := repo.GetFollowedByUser(bd.GetDB(), userID)
	if err != nil {
		tools.Log(err)
	}
	// Filtrer les noms
	users := filterNames(allU, follow)
	datas := map[string]interface{}{
		"content": content,
		"users":   users,
		"userID":  userID,
	}

	tools.ResponseJSON(w, http.StatusOK, datas)
}

func getProfileData(w http.ResponseWriter, r *http.Request, cookie string) {
	w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("Expires", "0")
	if app.IsConnected(w, r, cookie) {

		userID, err := repo.GetUserIDBySession(bd.GetDB(), cookie)
		if err != nil {
			tools.Log(err)
			return
		}

		filtre := r.URL.Query().Get("name")
		if filtre != "Event" && filtre != "General" && filtre != "Issue" && filtre != "Liked" {
			filtre = "all"
		}

		posts, err := repo.GetPostsByCategoryAndUser(bd.GetDB(), filtre, userID)
		if filtre == "Liked" {
			posts, err = repo.GetLikedPostsByUser(bd.GetDB(), userID)
		}

		if err != nil {

			tools.Log(err)
			return
		}
		ProfileData = RecoverPageInfo(w, r, posts, cookie)

		// Convertissez les données en format JSON
		responseData, err := json.Marshal(ProfileData)
		if err != nil {
			// Gérer l'erreur appropriée
			http.Error(w, "Erreur lors de la conversion en JSON", http.StatusInternalServerError)
			return
		}

		// Définissez le type de contenu de la réponse comme JSON
		w.Header().Set("Content-Type", "application/json")

		// Renvoyez les données JSON en réponse
		w.Write(responseData)
	}
}

func logout(w http.ResponseWriter, r *http.Request, server *WsServer) {
	cookie, _ := app.GetCookie(w, r)
	userID, err := repo.GetUserIDBySession(bd.GetDB(), cookie)
	if err != nil {
		tools.Log(err)
		return
	}
	for client := range server.clients {
		if client.ID == userID {
			client.disconnect()
		}
	}
	handleUserDisconnect(userID)
	repo.DeleteSession(bd.GetDB(), cookie)

	app.DeleteCookie(w, r)
	infolog := model.Loginfo{
		Status:  "",
		Message: "",
	}
	data := map[string]interface{}{
		"redirect": "/login",
		"infoLog":  infolog,
	}

	tools.ResponseJSON(w, http.StatusOK, data)
}

func post(w http.ResponseWriter, r *http.Request, dataContent model.Publications) {
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

		userID, err := repo.GetUserIDBySession(bd.GetDB(), dataContent.Cookie)
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
		if dataContent.Type == "circle" || dataContent.Type == "private" {
			private = true
		}
		tools.Debogage(dataContent.Type)

		postID := tools.NeewId()
		post := model.Post{
			PostID:       postID,
			UserID:       user.UserID,
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

		err = repo.CreatePost(bd.GetDB(), post)
		if err != nil {
			tools.Log(err)
			tools.ResponseJSON(w, http.StatusInternalServerError, map[string]interface{}{"status": "error", "code": http.StatusInternalServerError, "message": "Internal Server Error"})
			return
		}

		// Create a key for the post
		if private {
			userIDs := dataContent.Users
			key := app.AddKey(postID, userID, dataContent.Type) // Add in keys table
			app.AddUserKey(userIDs, key)                        // Add in user keys table
			for _, id := range userIDs {
				// Add notification
				app.AddNotification(userID, id, "private", "post", "aucun")
			}
		}

		userIDs := allIDs(userID) // Get all user IDs
		if !private {
			for _, id := range userIDs {
				// Add notification
				app.AddNotification(userID, id, "public", "post", "aucun")
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
		posts, err := repo.GetPostsByCategoryName(bd.GetDB(), "all")
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

// function to retrieve and sort all users and and check users connected and deconnected to fill the Connection structure table if the user is connected Ceonnection.Status ="" or if the user is deconnected Ceonnection.Status ="offline"
func GetConnection(idUser string) []model.Connection {
	var connections []model.Connection
	users, err := repo.GetUsers(bd.GetDB())
	if err != nil {

		tools.Log(err)
	}

	login, err := repo.GetUserByID(bd.GetDB(), idUser)
	if err != nil {
		tools.Log(err)
	}
	var tab []model.User
	for _, v := range users {
		if v != login {
			tab = append(tab, v)
		} else {
			continue
		}
	}

	for _, user := range tab {
		messages, err := repo.GetMessagesByUser(bd.GetDB(), user.UserID)
		if err != nil {
			tools.Log(err)
		}
		connect := model.Connection{}
		connect = model.Connection{
			UserID:  user.UserID,
			Name:    user.FirstName,
			Photo:   user.Photo,
			Status:  "offline",
			History: messages,
		}
		_, err = repo.GetSessionByUserI(bd.GetDB(), user.UserID)
		if err == nil {
			connect.Status = ""
		}
		connections = append(connections, connect)
	}
	return connections
}

/*----------------------------------------------------------------/
======================== GET MESSAGES ============================
/----------------------------------------------------------------*/

func getMessage(w http.ResponseWriter, cookie string) {

	if cookie == "" {
		tools.Log("cookie is empty")
		data := map[string]interface{}{
			"code":    http.StatusUnauthorized,
			"message": "Unauthorized",
		}
		tools.ResponseJSON(w, http.StatusUnauthorized, data)
		return
	}
	userID, err := repo.GetUserIDBySession(bd.GetDB(), cookie)
	if err != nil {

		tools.Log(err)
		return
	}
	messages, err := repo.GetMessagesByUser(bd.GetDB(), userID)
	if err != nil {

		tools.Log(err)
		return
	}
	tools.ResponseJSON(w, http.StatusOK, messages)
}

func loginHandler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
	// Décode le corps de la requête JSON dans une structure Credentials
	var credentials model.Credentials
	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		tools.Log(err)
		data := map[string]interface{}{
			"code":    http.StatusInternalServerError,
			"message": "Internal Server Error",
		}
		tools.ResponseJSON(w, http.StatusInternalServerError, data)
		return
	}
	log.Println("Credentials:", credentials.Identifiant, credentials.Password)
	Id = authentication(w, r, credentials.Identifiant, credentials.Password)
}

func registerHandler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
	if r.Method == "POST" {
		username := r.FormValue("identifiant")
		age := r.FormValue("age")
		about := r.FormValue("about")
		firstName := r.FormValue("first-name")
		lastName := r.FormValue("last-name")
		email := r.FormValue("email")
		password := r.FormValue("password")
		registration(w, r, username, email, password, age, firstName, lastName, about)
	}
}

func wSHandler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
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
		ServeWs(wsServer, w, r, cookie)
	}
}

func getProfileDataHandler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
	// Décode le corps de la requête JSON dans une structure Credentials
	var credentials model.Credentials
	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		tools.Log(err)
		data := map[string]interface{}{
			"code":    http.StatusInternalServerError,
			"message": "Internal Server Error",
		}
		tools.ResponseJSON(w, http.StatusInternalServerError, data)
		return
	}
	cookie := credentials.Cookie
	getProfileData(w, r, cookie)
}

func postHandler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
	var postContent model.Publications
	if err := json.NewDecoder(r.Body).Decode(&postContent); err != nil {
		tools.Log(err)
		data := map[string]interface{}{
			"code":    http.StatusInternalServerError,
			"message": "Internal Server Error",
		}
		tools.ResponseJSON(w, http.StatusInternalServerError, data)
		return
	}
	post(w, r, postContent)
}

func postGroupeHandler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
	var postContent model.Publications
	if err := json.NewDecoder(r.Body).Decode(&postContent); err != nil {
		tools.Log(err)
		data := map[string]interface{}{
			"code":    http.StatusInternalServerError,
			"message": "Internal Server Error",
		}
		tools.ResponseJSON(w, http.StatusInternalServerError, data)
		return
	}
	postGroup(w, r, postContent)
}

func likeHandler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
	// Décode le corps de la requête JSON dans une structure Credentials
	var request app.FeedbackRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		tools.Log(err)
		data := map[string]interface{}{
			"code":    http.StatusInternalServerError,
			"message": "Internal Server Error",
		}
		tools.ResponseJSON(w, http.StatusInternalServerError, data)
		return
	}
	cookie := request.Cookie
	if app.IsConnected(w, r, cookie) {
		// Perform action (like or dislike) and update counts
		response := app.PerformAction(cookie, request.PostID, r.URL.Query().Get("name"), request.Action)
		// Return the updated counts as JSON response
		fmt.Println("reponse", response)

		tools.ResponseJSON(w, http.StatusOK, response)
	} else {
		fmt.Println("bad request like: ", r.Body)
		tools.ResponseJSON(w, http.StatusBadRequest, "bad request")
		return
	}

}

func settingHandler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
	// // Décode le corps de la requête JSON dans une structure Credentials
	// body, err := io.ReadAll(r.Body)
	// if err != nil {
	// 	return
	// }
	// tools.Debogage(r)

	var data model.Settings
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		tools.Log(err)
		data := map[string]interface{}{
			"code":    http.StatusInternalServerError,
			"message": "Internal Server Error",
		}
		tools.ResponseJSON(w, http.StatusInternalServerError, data)
		return
	}

	setting(w, r, data)
}

func logoutHandler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
	logout(w, r, wsServer)
}

func getSectionContentHandler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
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
	getSectionContent(w, r, cookie)
}

func getDataProfilesHandler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
	_, err := app.GetCookie(w, r)
	if err != nil {
		tools.Log(err)
		data := map[string]interface{}{
			"code":    http.StatusUnauthorized,
			"message": "Unauthorized",
		}
		tools.ResponseJSON(w, http.StatusUnauthorized, data)
		return
	}
	// var datas model.Credentials
	var datas model.Credentials
	if err := json.NewDecoder(r.Body).Decode(&datas); err != nil {
		tools.Log(err)
		tools.ResponseJSON(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}

	//a ajouter : le nombre de followers, les groupes auquel lutilsateur appartient et les events
	// logique pour filtrer les posts publiques et prives
	content := datasProfil(w, r, datas.Identifiant) //retourne les posts uniquement

	tools.ResponseJSON(w, http.StatusOK, content)
}

// Post du groupe
func groupsHandler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
	_, err := app.GetCookie(w, r)
	if err != nil {
		tools.Log(err)
		data := map[string]interface{}{
			"code":    http.StatusUnauthorized,
			"message": "Unauthorized",
		}
		tools.ResponseJSON(w, http.StatusUnauthorized, data)
		return
	}
	// var datas model.Credentials
	var datas model.Credentials
	if err := json.NewDecoder(r.Body).Decode(&datas); err != nil {
		tools.Log(err)
		tools.ResponseJSON(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}

	//a ajouter : le nombre de followers, les groupes auquel lutilsateur appartient et les events
	// logique pour filtrer les posts publiques et prives
	content := datasGroup(w, r, datas.Identifiant) //retourne les posts uniquement

	tools.ResponseJSON(w, http.StatusOK, content)
}

func getMessageHandler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
	// Décode le corps de la requête JSON dans une structure Credentials
	var credentials model.Credentials
	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		tools.Log(err)
		data := map[string]interface{}{
			"code":    http.StatusInternalServerError,
			"message": "Internal Server Error",
		}
		tools.ResponseJSON(w, http.StatusInternalServerError, data)
		return
	}
	cookie := credentials.Cookie
	getMessage(w, cookie)
}

func checkStatusHandler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
	// Décode le corps de la requête JSON dans une structure Credentials
	var credentials model.Credentials
	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		tools.Log(err)
		data := map[string]interface{}{
			"code":    http.StatusInternalServerError,
			"message": "Internal Server Error",
		}
		tools.ResponseJSON(w, http.StatusInternalServerError, data)
		return
	}
	cookie := credentials.Cookie
	checkStatus(w, r, cookie)
}

func updateMessageVisibilityHandler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
	// Décode le corps de la requête JSON dans une structure Credentials
	var datas model.MessageData
	if err := json.NewDecoder(r.Body).Decode(&datas); err != nil {
		tools.Log(err)
		data := map[string]interface{}{
			"code":    http.StatusInternalServerError,
			"message": "Internal Server Error",
		}
		tools.ResponseJSON(w, http.StatusInternalServerError, data)
		return
	}

	updateMessageVisibility(w, r, datas)
}

func apiSettingsHandler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
	// Décode le corps de la requête JSON dans une structure Credentials
	var credentials model.Credentials
	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		tools.Log(err)
		data := map[string]interface{}{
			"code":    http.StatusInternalServerError,
			"message": "Internal Server Error",
		}
		tools.ResponseJSON(w, http.StatusInternalServerError, data)
		return
	}
	cookie := credentials.Cookie
	api.SettingApi(w, r, cookie)
}

func allPostHandler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
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
	if !app.IsConnected(w, r, cookie) {
		tools.Log(err)
		data := map[string]interface{}{
			"code":    http.StatusUnauthorized,
			"message": "Unauthorized",
		}
		tools.ResponseJSON(w, http.StatusUnauthorized, data)
		return
	}

	allPost(w, cookie)
}

func allUsersHandler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
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
		allUsers(w, cookie)
	} else {
		data := map[string]interface{}{
			"code":    http.StatusUnauthorized,
			"message": "Unauthorized",
		}
		tools.ResponseJSON(w, http.StatusUnauthorized, data)
	}
}

func handleConnectionsHandler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
	HandleConnections(w, r)
}

func followUser(w http.ResponseWriter, r *http.Request, ws *WsServer) {
	var follow model.Follow
	// Décodage du JSON à partir du tableau de bytes
	if err := json.NewDecoder(r.Body).Decode(&follow); err != nil {
		tools.Log(err)
		data := map[string]interface{}{
			"code":    http.StatusInternalServerError,
			"message": "Internal Server Error",
		}
		tools.ResponseJSON(w, http.StatusInternalServerError, data)
		return
	}
	if app.IsConnected(w, r, follow.Cookie) {
		userID, err := repo.GetUserIDBySession(bd.GetDB(), follow.Cookie)
		if err != nil {
			tools.Log(err)
			data := map[string]interface{}{
				"code":    http.StatusInternalServerError,
				"message": "Internal Server Error",
			}
			tools.ResponseJSON(w, http.StatusInternalServerError, data)
			return
		}
		// verifier si le profil est public

		usr, err := repo.GetUserByID(bd.GetDB(), follow.FollowedUser)
		if err != nil {
			tools.Log(err)
			data := map[string]interface{}{
				"code":    http.StatusInternalServerError,
				"message": "Internal Server Error",
			}
			tools.ResponseJSON(w, http.StatusInternalServerError, data)
			return
		}
		if usr.StatusProfil == "public" || follow.FollowType == "unfollow" {
			app.AddFollow(userID, follow.FollowedUser, follow.FollowType)
		} else {
			// Add notification
			app.AddNotification(userID, follow.FollowedUser, "private", follow.FollowType, "aucun")
		}

		allU := GetConnection(userID)
		followeds, err := repo.GetFollowedByUser(bd.GetDB(), userID)
		if err != nil {
			tools.Log(err)
		}

		// Filtrer les noms
		users := filterNames(allU, followeds)
		data := map[string]interface{}{
			"users": users,
		}
		tools.ResponseJSON(w, http.StatusCreated, data)
	}

}

func getFollowers(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
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
	if app.IsConnected(w, r, credentials.Cookie) {
		userID, err := repo.GetUserIDBySession(bd.GetDB(), credentials.Cookie)
		if err != nil {
			tools.Log(err)
			return
		}
		user, err := repo.GetUserByID(bd.GetDB(), userID)
		if err != nil {
			tools.Log(err)
			return
		}
		followTab, err := repo.GetFollowersByUser(bd.GetDB(), user.UserID)
		if err != nil {
			data := map[string]interface{}{
				"code":    http.StatusInternalServerError,
				"message": "Internal Server Error",
			}
			tools.ResponseJSON(w, http.StatusInternalServerError, data)
			return
		}
		followedTab, err := repo.GetFollowedByUser(bd.GetDB(), user.UserID)
		if err != nil {
			data := map[string]interface{}{
				"code":    http.StatusInternalServerError,
				"message": "Internal Server Error",
			}
			tools.ResponseJSON(w, http.StatusInternalServerError, data)
			return
		}
		var users []model.User
		for _, v := range followTab {
			user, err := repo.GetUserByID(bd.GetDB(), v.UserID)
			if err != nil {
				tools.Log(err)
				return
			}
			users = append(users, user)
		}
		// followed
		var usersFollowed []model.User

		for _, v := range followedTab {
			user, err := repo.GetUserByID(bd.GetDB(), v.FollowedUser)
			if err != nil {
				tools.Log(err)
				return
			}
			usersFollowed = append(usersFollowed, user)
		}
		data := map[string]interface{}{
			"followers":       followTab,
			"nubers":          len(followTab),
			"users":           users,
			"followed":        usersFollowed,
			"numbersFollowed": len(usersFollowed),
		}

		tools.ResponseJSON(w, http.StatusOK, data)
	}
}

func eventHandler(w http.ResponseWriter, r *http.Request, ws *WsServer) {
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
		titre := r.FormValue("titre")
		description := r.FormValue("description")
		date := r.FormValue("date")
		idGroup := r.FormValue("groupID")

		userID, err := repo.GetUserIDBySession(bd.GetDB(), cookie)
		if err != nil {
			tools.Log(err)
			data := map[string]interface{}{
				"code":    http.StatusUnauthorized,
				"message": "Unauthorized",
			}
			tools.ResponseJSON(w, http.StatusUnauthorized, data)
			return
		}
		image := "event.jpg"

		file, _, _ := r.FormFile("image")
		if file != nil {
			img, err := tools.UploadAvatar(w, r, "image", userID)
			if err != nil {
				tools.Log(err)
				tools.ResponseJSON(w, http.StatusBadRequest, err)
				return
			}

			if img != "" {
				image = img
			}
		}
		var event model.Event

		dates, err := time.Parse("2006-01-02", date)
		if err != nil {
			data := map[string]interface{}{
				"code":    http.StatusBadRequest,
				"message": "bad date",
			}
			tools.ResponseJSON(w, http.StatusBadRequest, data)
			tools.Log(err)
			return
		}
		if !tools.ValidEventDate(dates) || titre == "" || description == "" {
			err := "fields are required"
			data := map[string]interface{}{
				"code":    http.StatusBadRequest,
				"message": err,
			}
			tools.ResponseJSON(w, http.StatusBadRequest, data)
			return
		}
		eventID := tools.NeewId()
		event.EventID = eventID
		event.Title = titre
		event.Description = description
		event.Date = date
		event.UserID = userID
		event.Image = image
		event.GroupID = idGroup
		err = app.AddEvents(event)
		if err != nil {
			data := map[string]interface{}{
				"code":    http.StatusInternalServerError,
				"message": "Internal Server error",
			}
			tools.ResponseJSON(w, http.StatusInternalServerError, data)
			tools.Log(err)
			return
		}

		members, err := repo.GetGroupMembers(bd.GetDB(), idGroup)
		if err != nil {
			data := map[string]interface{}{
				"code":    http.StatusInternalServerError,
				"message": "Internal Server error",
			}
			tools.ResponseJSON(w, http.StatusInternalServerError, data)
			tools.Log(err)
			return
		}

		for _, id := range members {
			app.AddNotification(userID, id, "private", "event", eventID)
		}

		tools.ResponseJSON(w, http.StatusCreated, "Event Created")
	}
}

func getFollowersInvite(w http.ResponseWriter, r *http.Request, server *WsServer) {
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
	idInvit := credentials.Identifiant

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
		isFollw := false
		user, err := repo.GetUserByID(bd.GetDB(), idInvit)
		if err != nil {
			tools.Log(err)
			data := map[string]interface{}{
				"code":    http.StatusInternalServerError,
				"message": "Internal Server Error",
			}
			tools.ResponseJSON(w, http.StatusInternalServerError, data)
			return
		}
		followTab, err := repo.GetFollowersByUser(bd.GetDB(), user.UserID)
		if err != nil {
			tools.Log(err)
			data := map[string]interface{}{
				"code":    http.StatusInternalServerError,
				"message": "Internal Server Error",
			}
			tools.ResponseJSON(w, http.StatusInternalServerError, data)
			return
		}

		followedTab, err := repo.GetFollowedByUser(bd.GetDB(), user.UserID)
		if err != nil {
			data := map[string]interface{}{
				"code":    http.StatusInternalServerError,
				"message": "Internal Server Error",
			}
			tools.ResponseJSON(w, http.StatusInternalServerError, data)
			return
		}

		for _, v := range followTab {
			if v.UserID == userID {
				isFollw = true
				break
			}
		}
		var users []model.User

		for _, v := range followTab {
			user, err := repo.GetUserByID(bd.GetDB(), v.UserID)
			if err != nil {
				tools.Log(err)
				return
			}
			users = append(users, user)
		}
		// followed
		var usersFollowed []model.User

		for _, v := range followedTab {
			user, err := repo.GetUserByID(bd.GetDB(), v.FollowedUser)
			if err != nil {
				tools.Log(err)
				return
			}
			usersFollowed = append(usersFollowed, user)
		}
		data := map[string]interface{}{
			"nombre":          len(followTab),
			"follwers":        users,
			"isFollow":        isFollw,
			"followed":        usersFollowed,
			"numbersFollowed": len(usersFollowed),
			"status":          user.StatusProfil,
		}

		tools.ResponseJSON(w, http.StatusOK, data)
	}
}

/*----------------------------------------------------------------/
========================== GROUPES ================================
/----------------------------------------------------------------*/

func allGroupsHandler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
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
	app.AllGroups(w, r, cookie)
}

func membersHandler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
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
		// Décode le corps de la requête JSON dans une structure Credentials
		var credentials model.Credentials
		if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
			tools.Log(err)
			data := map[string]interface{}{
				"code":    http.StatusInternalServerError,
				"message": "Internal Server Error",
			}
			tools.ResponseJSON(w, http.StatusInternalServerError, data)
			return
		}
		userID, _ := repo.GetUserIDBySession(bd.GetDB(), cookie)

		userIDS, err := repo.GetGroupMembers(bd.GetDB(), credentials.Identifiant)
		if err != nil {
			tools.Log(err)
			data := map[string]interface{}{
				"code":    http.StatusInternalServerError,
				"message": "Internal Server Error",
			}
			tools.ResponseJSON(w, http.StatusInternalServerError, data)
			return
		}
		var external []model.Connection
		uses := GetConnection(userID)

		for _, usr := range uses {
			found := false
			for _, id := range userIDS {
				if usr.UserID == id {
					found = true
					break
				}
			}
			if !found {
				external = append(external, usr)
			}
		}

		membersList, err := members(userIDS)
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
			"members":   membersList,
			"externals": external,
		}
		// tools.Debogage(data)
		tools.ResponseJSON(w, http.StatusOK, data)
	}
}

func getNotificationHandler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
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
			data := map[string]interface{}{
				"code":    http.StatusInternalServerError,
				"message": "Internal Server Error",
			}
			tools.ResponseJSON(w, http.StatusInternalServerError, data)
			return
		}

		// Récupérer le numéro de page à partir des paramètres de requête
		pageStr := r.URL.Query().Get("page")
		page, err := strconv.Atoi(pageStr)
		if err != nil {
			tools.Log(err)
			http.Error(w, "Invalid page number", http.StatusBadRequest)
			return
		}

		// Calculer l'offset
		notificationsPerPage := 2
		offset := (page - 1) * notificationsPerPage
		var notifLists []model.Notification
		if page == 1 {
			notifLists, err = repo.GetNotificationByUser(bd.GetDB(), userID, offset, notificationsPerPage)
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

		if page == 0 {
			notifLists, err = repo.GetAllNotificationByUser(bd.GetDB(), userID)
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

		usr := make([]map[string]interface{}, 0)
		groupName := ""

		for _, notif := range notifLists {
			user, _ := repo.GetUserByID(bd.GetDB(), notif.UserID)
			if notif.GroupID != "aucun" && notif.Category != "event"{
				group, _ := repo.GetGroupByGroupID(bd.GetDB(), notif.GroupID)
        groupName = group.GroupTitle
			}
			if notif.Category == "event" {
				group, _ := repo.GetGroupByEventID(bd.GetDB(), notif.GroupID)
				groupName = group.GroupTitle
			}

			userMap := make(map[string]interface{})
			userMap["username"] = user.FirstName
			userMap["email"] = user.Email
			userMap["senderID"] = notif.UserID
			userMap["category"] = notif.Category
			userMap["type"] = notif.Type
			userMap["photo"] = user.Photo
			userMap["created_at"] = notif.CreatedAt
			userMap["groupID"] = notif.GroupID
			userMap["notifID"] = notif.NotificationID
			userMap["groupName"] = groupName
			userMap["vu"] = notif.Vu

			usr = append(usr, userMap)
		}

		data := map[string]interface{}{
			"notifications": usr,
			"number":        len(usr),
		}

		tools.ResponseJSON(w, http.StatusOK, data)
	}
}

// Envoie d'invitation
func sendInviteHandler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
	var follow model.Follow
	// Décodage du JSON à partir du tableau de bytes
	if err := json.NewDecoder(r.Body).Decode(&follow); err != nil {
		tools.Log(err)
		data := map[string]interface{}{
			"code":    http.StatusInternalServerError,
			"message": "Internal Server Error",
		}
		tools.ResponseJSON(w, http.StatusInternalServerError, data)
		return
	}
	if app.IsConnected(w, r, follow.Cookie) {
		userID, err := repo.GetUserIDBySession(bd.GetDB(), follow.Cookie)
		if err != nil {
			tools.Log(err)
			data := map[string]interface{}{
				"code":    http.StatusUnauthorized,
				"message": "Unauthorized",
			}
			tools.ResponseJSON(w, http.StatusUnauthorized, data)
			return
		}

		// Add notification
		app.AddNotification(userID, follow.FollowedUser, "private", follow.FollowType, "aucun")

		tools.ResponseJSON(w, http.StatusOK, "")
	}

}

type SaveDB struct {
	Cookie     string `json:"cookie"`
	SenderID   string `json:"senderID"`
	ReceiverID string `json:"receiverID"`
	Category   string `json:"category"`
	Type       string `json:"type"`
	Reponse    string `json:"response"`
	GroupID    string `json:"groupID"`
	NotifID    string `json:"notifID"`
}

// Reponse aux demandes et aux invitations
func responseForInvit(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
	var data SaveDB
	// Décodage du JSON à partir du body
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
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

	switch data.Category {
	case "follow":
		followRequest(data.SenderID, data.ReceiverID, data.NotifID, data.Type)
	case "event":
		responseToParticpe(userID, data.GroupID, data.NotifID, data.Type)
	case "inscription":
		responseToRejoin(userID, data.GroupID, data.NotifID, data.Type)
	case "unfollow":
		followRequest(data.SenderID, data.ReceiverID, data.NotifID, data.Type)
	default:
		break
	}
	tools.ResponseJSON(w, http.StatusOK, "")
}

// Accept or reject following requests
func followRequest(userID, receiverID, notifID, types string) interface{} {
	app.AddFollow(userID, receiverID, types)
	allU := GetConnection(userID)
	followeds, err := repo.GetFollowedByUser(bd.GetDB(), receiverID)
	if err != nil {
		tools.Log(err)
	}
	// Supprimer la notification
	repo.DeleteNotification(bd.GetDB(), notifID)
	if err != nil {
		tools.Log(err)
	}

	// Filtrer les noms
	users := filterNames(allU, followeds)
	data := map[string]interface{}{
		"users": users,
	}
	return data
}

// send invitation to add group
func sendInvite(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
	var data SaveDB
	// Décodage du JSON à partir du body
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		tools.Log(err)
		data := map[string]interface{}{
			"code":    http.StatusInternalServerError,
			"message": "Internal Server Error",
		}
		tools.ResponseJSON(w, http.StatusInternalServerError, data)
		return
	}
	if app.IsConnected(w, r, data.Cookie) {
		userID, err := repo.GetUserIDBySession(bd.GetDB(), data.Cookie)
		if err != nil {
			tools.Log(err)
			data := map[string]interface{}{
				"code":    http.StatusUnauthorized,
				"message": "Unauthorized",
			}
			tools.ResponseJSON(w, http.StatusUnauthorized, data)
			return
		}

		// Add notification
		app.AddNotification(userID, data.ReceiverID, "private", data.Category, data.GroupID)

		tools.ResponseJSON(w, http.StatusOK, "")
	}
}

// Accept invitation to rejoin group
func responseToRejoin(receiverID, groupID, notifID, types string) {
	// Supprimer la notification
	err := repo.DeleteNotification(bd.GetDB(), notifID)
	if err != nil {
		tools.Log(err)
	}

	if types == "accept" {
		fmt.Println("groupID:", groupID)
		err = repo.AddMemberToGroup(bd.GetDB(), groupID, receiverID)
		if err != nil {
			tools.Log(err)
		}
	}
}

// Accept invitation to particip an event
func responseToParticpe(receiverID, eventID, notifID, types string) {
	// Supprimer la notification
	err := repo.DeleteNotification(bd.GetDB(), notifID)
	if err != nil {
		tools.Log(err)
	}

	if types == "accept" {
		err = repo.AddMemberToEventMembers(bd.GetDB(), eventID, receiverID)
		if err != nil {
			tools.Log(err)
		}
	}
}

func datasGroup(w http.ResponseWriter, r *http.Request, visitedID string) interface{} {
	cookie, _ := app.GetCookie(w, r)
	filtre := r.URL.Query().Get("name")
	if filtre != "Event" && filtre != "General" && filtre != "Issue" && filtre != "Liked" {
		filtre = "all"
	}
	posts, err := repo.GetGroupPostsByCategoryAndUser(bd.GetDB(), filtre, visitedID)
	if filtre == "Liked" {
		posts, err = repo.GetLikedGroupPostsByUser(bd.GetDB(), visitedID)
	}
	if err != nil {
		tools.Log(err)
		return model.PageInfo{}
	}
	
	userID, _ := repo.GetUserIDBySession(bd.GetDB(), cookie)
	follow, err := repo.GetFollowedByUser(bd.GetDB(), userID)
	data := GetConnection(userID)
	if err != nil {
		tools.Log(err)
	}
	// Filtrer les noms
	userList := filterNames(data, follow)
	// evenement du groupe
	events, err := repo.GetEventByGroupId(bd.GetDB(), visitedID)
	if err != nil {
		tools.Log(err)
	}

	// app.InitPostAndCommentLikeAndDislike(posts)
	response := map[string]interface{}{
		"success":     true,
		"publication": app.InitPostAndCommentLikeAndDislike(posts),
		"user":        userList,
		"events":      events,
	}

	return response
}
