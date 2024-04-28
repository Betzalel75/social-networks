package app

import (
	bd "forum/internal/database"
	repo "forum/internal/database/repository"
	model "forum/internal/models"
	"forum/internal/tools"
)

func AddFollow(useID, name, typef string) {
	l := model.Follow{
		FollowID:     tools.NeewId(),
		UserID:       useID,
		FollowedUser: name,
		FollowType: typef,
	}

	repo.CreateFollow(bd.GetDB(), l)

}
