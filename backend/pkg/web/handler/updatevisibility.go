package handler

import (
	bd "forum/pkg/db/sqlite"
	repo "forum/pkg/db/sqlite/repository"
	model "forum/pkg/internal/models"
	"forum/pkg/tools"
	"net/http"
)

func updateMessageVisibility(w http.ResponseWriter, r *http.Request, datas model.MessageData) {
	// Vérifier que la méthode HTTP est POST
	if r.Method != "POST" {
		tools.Log("Méthode non autorisée")
		tools.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]interface{}{"status": "error", "code": http.StatusMethodNotAllowed, "message": "Méthode non autorisée"})
		return
	}

	// Vérifier que l'utilisateur est connecté
	message, err := repo.GetMessageByID(bd.GetDB(), datas.MessageID)

	if err != nil {
		tools.Log(err)
		tools.ResponseJSON(w, http.StatusNotFound, map[string]interface{}{"status": "error", "code": http.StatusNotFound, "message": "Message non trouvé"})
		return
	}

	userID, err := repo.GetUserIDBySession(bd.GetDB(), datas.Cookie)
	if err != nil {
		return
	}
	if message.ReceiverID == userID {
		// Mettre à jour la visibilité du message dans la base de données
		err = repo.UpdateMessageVisibility(bd.GetDB(), userID, datas.NewVisibility)
		if err != nil {
			tools.Log(err)
			tools.ResponseJSON(w, http.StatusInternalServerError, map[string]interface{}{"status": "error", "code": http.StatusInternalServerError, "message": "Internal Server Error"})
			return
		}

	}
	// Envoyer une réponse JSON indiquant que la mise à jour a réussi
	response := map[string]interface{}{"status": "success", "message": "Statut du message mis à jour avec succès"}
	tools.ResponseJSON(w, http.StatusOK, response)
}

// Update visibility notification
func updateNotifView(w http.ResponseWriter, r *http.Request, datas model.MessageData) {
	// Vérifier que la méthode HTTP est POST
	if r.Method != "POST" {
		tools.Log("Méthode non autorisée")
		tools.ResponseJSON(w, http.StatusMethodNotAllowed, map[string]interface{}{"status": "error", "code": http.StatusMethodNotAllowed, "message": "Méthode non autorisée"})
		return
	}
	// Mettre à jour la visibilité du message dans la base de données
	err := repo.UpdateNotification(bd.GetDB(), datas.MessageID, datas.NewVisibility)
	if err != nil {
		tools.Log(err)
		tools.ResponseJSON(w, http.StatusInternalServerError, map[string]interface{}{"status": "error", "code": http.StatusInternalServerError, "message": "Internal Server Error"})
		return
	}

	// Envoyer une réponse JSON indiquant que la mise à jour a réussi
	response := map[string]interface{}{"status": "success", "message": "Statut du message mis à jour avec succès"}
	tools.ResponseJSON(w, http.StatusOK, response)
}
