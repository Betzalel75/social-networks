package app

import (
	"database/sql"
	bd "forum/internal/database"
	repo "forum/internal/database/repository"
	model "forum/internal/models"
	"forum/internal/tools"
	"time"
)

func AddNotification(useID, receiver_id, typef, category, group_id string) {
	vu := false
	if category == "unfollow" {
		vu = true
	}
	times := time.Now()
	layout := "02/01/2006 15:04:05" // Format jour/mois/année heure:minute:secondes

	creat_at, err := time.Parse(layout, times.Format(layout))
	if err != nil {
		tools.Log(err)
		return
	}
	l := model.Notification{
		NotificationID: tools.NeewId(),
		UserID:         useID,
		Receiver_id:    receiver_id,
		Type:           typef,
		Category:       category,
		Vu:             sql.NullBool{Valid: true, Bool: vu},
		CreatedAt:      creat_at,
		GroupID:        group_id,
	}

	repo.CreateNotification(bd.GetDB(), l)
}
