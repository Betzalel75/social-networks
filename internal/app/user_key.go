package app

import (
	bd "forum/internal/database"
	repo "forum/internal/database/repository"
)

func AddUserKey(sharedUserIDs []string, keyID string) {
	for _, sharedUserID := range sharedUserIDs {	
		repo.CreateUserKey(bd.GetDB(), sharedUserID, keyID)
	}
}
