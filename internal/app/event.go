package app

import (
	bd "forum/internal/database"
	repo "forum/internal/database/repository"
	model "forum/internal/models"
	"forum/internal/tools"
)

func AddEvents(e model.Event) error {
	err := repo.CreateEvents(bd.GetDB(), e)
	if err != nil {
		tools.Log(err)
		return err
	}
	err = repo.CreateEventMembers(bd.GetDB(), model.EventMember{EventMemberID: "event-"+tools.NeewId(), EventID: e.EventID, UserID: e.UserID})
	if err != nil {
		tools.Log(err)
		return err
	}
	return nil
}
