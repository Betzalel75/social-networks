package app

import (
	bd "forum/internal/database"
	repo "forum/internal/database/repository"
	model "forum/internal/models"
	"forum/internal/tools"
)

// Functions for Created key
func AddKey(postId, userID, private string) string{
	p := false
	if private == "circle" {
		p = true
	}
	key := tools.NeewId()
	k := model.Key{
		KeyID:   key,
		UserID:  userID,
		Key:     postId,
		Private: p,
	}
	repo.CreateKey(bd.GetDB(), k)
	return key
}
