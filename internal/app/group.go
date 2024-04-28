package app

import (
	"errors"
	bd "forum/internal/database"
	repo "forum/internal/database/repository"
	model "forum/internal/models"
	"forum/internal/tools"
	"log"
	"net/http"
	"time"
)

func AddGroup(title, desc, owner_id string) (model.Group, error) {
	if title != "" && desc != "" && owner_id != "" {
		group := model.Group{
			GroupId:    tools.NeewId(),
			GroupTitle: title,
			GroupDesc:  desc,
			GroupOwner: owner_id,
			GroupUsers: owner_id,
			Type:       "NewGroup",
			CreatedAt:  time.Now(),
		}
		er := repo.CreateGroup(bd.GetDB(), group)
		if er != nil {
			tools.Log(er)
			return group, er
		}
		return group, nil
	} else {
		log.Println("il y a un truc qui n'a pas fonctionner")
		return model.Group{}, errors.New(("missing a required field"))
	}
}

func AllGroups(w http.ResponseWriter, r *http.Request, cookie string) {
	_, err := repo.GetSessionByID(bd.GetDB(), cookie)
	if err != nil {
		tools.Log(err)
		tools.ResponseJSON(w, http.StatusUnauthorized, nil)
		return
	}

	groups, err := repo.GetGroups(bd.GetDB())
	if err != nil {
		tools.Log(err)
		return
	}
	// tools.Debogage(groups)

	tools.ResponseJSON(w, http.StatusOK, groups)
}
