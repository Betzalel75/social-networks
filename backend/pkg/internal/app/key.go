package app

import (
	bd "forum/pkg/db/sqlite"
	repo "forum/pkg/db/sqlite/repository"
	model "forum/pkg/internal/models"
	"forum/pkg/tools"
)

// Functions for Created key
func AddKey(postId, userID, private string) string {
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
