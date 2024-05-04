package app

import (
	bd "forum/pkg/db/sqlite"
	repo "forum/pkg/db/sqlite/repository"
	model "forum/pkg/internal/models"
	"forum/pkg/tools"
)

func AddFollow(useID, name, typef string) {
	l := model.Follow{
		FollowID:     tools.NeewId(),
		UserID:       useID,
		FollowedUser: name,
		FollowType:   typef,
	}

	repo.CreateFollow(bd.GetDB(), l)

}
