package handler

import (
	"fmt"
	"forum/internal/tools"
	"net/http"
)

// Définir un type pour le gestionnaire de route
type RouteHandler func(http.ResponseWriter, *http.Request, *WsServer)

// Définir une map qui associe les chemins d'URL aux fonctions de gestionnaires correspondantes
var routes = map[string]RouteHandler{
	"/":                        forum,
	"/allUsers":                allUsersHandler,
	"/check":                   handleConnectionsHandler,
	"/check-status":            checkStatusHandler,
	"/creatEvent":              eventHandler,
	"/follow":                  followUser,
	"/followers":               getFollowers,
	"/getNotification":         getNotificationHandler,
	"/getFollowersInvite":      getFollowersInvite,
	"/getmessages":             getMessageHandler,
	"/getsettings":             apiSettingsHandler,
	"/getprofiledata":          getProfileDataHandler,
	"/getgroups":               allGroupsHandler,
	"/getmembers":              membersHandler,           // Reccupere all members of the group
	"/get-posts":               allPostHandler,           // Filtre de tous les postes de la partie Forum
	"/getSectionContent":       getSectionContentHandler, // Filtre de tous les postes de la partie Profile
	"/getDataProfiles":         getDataProfilesHandler,   // Route pour le profil invite
	"/groups":                  groupsHandler,            // Reccupere post of the group
	"/sendInvite":              sendInviteHandler,        // Route pour envoyer une invitation ou une demande
	"/like":                    likeHandler,
	"/login":                   loginHandler,
	"/logout":                  logoutHandler,
	"/post":                    postHandler,
	"/post-groups":             postGroupeHandler,
	"/register":                registerHandler,
	"/response":                responseForInvit, // Route pour les reponses accept/reject
	"/settings":                settingHandler,
	"/join":                    sendInvite, // Route pour envoyer une invitation pour integrer un groupe
	"/updateMessageVisibility": updateMessageVisibilityHandler,
	"/updateStatus":            updateStatusHandler,
	"/ws":                      wSHandler,
}

// Handler utilise la map routes pour rediriger vers le bon gestionnaire de route
func Handler(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
	if handler, ok := routes[r.URL.Path]; ok {
		// Vérifier la méthode de la requête
		if r.Method == http.MethodOptions {
			// Répondre avec les en-têtes CORS appropriés pour les demandes OPTIONS
			tools.Debogage("cors")
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "POST")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			w.WriteHeader(http.StatusOK)
			return
		}

		handler(w, r, wsServer) // Appel du gestionnaire correspondant
	} else {
		tools.Log("Page not found")
		fmt.Println("Method: ", r.Method)
		fmt.Println("URL: ", r.URL.Path)
		StatusError(w, r, http.StatusNotFound, "Not found")
	}
}
