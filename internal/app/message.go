package app

import (
	"database/sql"
	bd "forum/internal/database"
	repo "forum/internal/database/repository"
	model "forum/internal/models"
	"forum/internal/tools"
	"time"
)

func AddContentMessage(receiverID, content, submit, cookie, id string) {
	if receiverID != "" && content != "" && submit == "Send message" {
		senderID, err := repo.GetUserIDBySession(bd.GetDB(), cookie)
		if err != nil {
			tools.LogErr(err)
			tools.Log(err)
			return
		}
		user, err := repo.GetUserByID(bd.GetDB(), senderID)
		if err != nil {
			tools.LogErr(err)
			tools.Log(err)
			return
		}
		times := time.Now()
		layout := "02/01/2006 15:04:05" // Format jour/mois/année heure:minute:secondes

		creat_at, err := time.Parse(layout, times.Format(layout))
		if err != nil {
			tools.Log(err)
			return
		}

		message := model.Message{
			MessageID:  id,
			SenderID:   senderID,
			ReceiverID: receiverID,
			Content:    content,
			SenderName: user.FirstName,
			CreatedAt:  creat_at,
			Vu:         sql.NullBool{Valid: false},
		}

		err = repo.CreateMessage(bd.GetDB(), message)
		if err != nil {
			tools.LogErr(err)
			tools.Log(err)
			return
		}
	}
}
