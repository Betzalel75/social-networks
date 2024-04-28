package app

import (
	bd "forum/internal/database"
	repo "forum/internal/database/repository"
	model "forum/internal/models"
)

func AddEvents(e model.Event) {
	repo.CreateEvents(bd.GetDB(), e)
}
