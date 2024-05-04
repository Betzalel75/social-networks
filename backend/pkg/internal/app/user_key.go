package app

import (
	bd "forum/pkg/db/sqlite"
	repo "forum/pkg/db/sqlite/repository"
)

func AddUserKey(sharedUserIDs []string, keyID string) {
	for _, sharedUserID := range sharedUserIDs {
		repo.CreateUserKey(bd.GetDB(), sharedUserID, keyID)
	}
}
