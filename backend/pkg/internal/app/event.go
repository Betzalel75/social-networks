package app

import (
	bd "forum/pkg/db/sqlite"
	repo "forum/pkg/db/sqlite/repository"
	model "forum/pkg/internal/models"
	"forum/pkg/tools"
)

func AddEvents(e model.Event) error {
	err := repo.CreateEvents(bd.GetDB(), e)
	if err != nil {
		tools.Log(err)
		return err
	}
	err = repo.CreateEventMembers(bd.GetDB(), model.EventMember{EventMemberID: "event-" + tools.NeewId(), EventID: e.EventID, UserID: e.UserID})
	if err != nil {
		tools.Log(err)
		return err
	}
	return nil
}
