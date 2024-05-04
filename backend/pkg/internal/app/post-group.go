package app

import (
	bd "forum/pkg/db/sqlite"
	repo "forum/pkg/db/sqlite/repository"
	model "forum/pkg/internal/models"
	"forum/pkg/tools"
	"net/http"
	"time"
)

func AddPostGroup(w http.ResponseWriter, r *http.Request, cookie string) {
	if IsConnected(w, r, cookie) {
		if IsFieldPostValidd(r) {
			userID, err := repo.GetUserIDBySession(bd.GetDB(), cookie)
			if err != nil {
				tools.LogErr(err)
				tools.Log(err)
				return
			}
			user, err := repo.GetUserByID(bd.GetDB(), userID)
			if err != nil {
				tools.LogErr(err)
				tools.Log(err)
				return
			}
			postID := tools.NeewId()
			times := time.Now()
			layout := "02/01/2006 15:04:05" // Format jour/mois/année heure:minute:secondes

			creat_at, err := time.Parse(layout, times.Format(layout))
			if err != nil {
				tools.Log(err)
				return
			}
			post := model.Post{
				PostID:       postID,
				UserID:       userID,
				Title:        r.PostFormValue("title"),
				Content:      r.PostFormValue("desc"),
				Photo:        user.Photo,
				Name:         user.FirstName,
				LikeCount:    0,
				DislikeCount: 0,
				CommentCount: 0,
				CreatedAt:    creat_at,
			}

			like := model.Like{
				LikeID: tools.NeewId(),
				UserID: userID,
				PostID: postID,
				Type:   0,
			}

			err = repo.CreateLike(bd.GetDB(), like)

			if err != nil {
				tools.LogErr(err)
				tools.Log(err)
				return
			}

			err = repo.CreatePost(bd.GetDB(), post)
			if err != nil {
				tools.LogErr(err)
				tools.Log(err)
				return
			}
			categorie := model.Category{
				CategoryID: tools.NeewId(),
				PostID:     postID,
				Name:       "all",
			}
			r.ParseForm()
			for _, cat := range r.PostForm["cat"] {
				catID := tools.NeewId()
				categorie := model.Category{
					CategoryID: catID,
					PostID:     postID,
					Name:       cat,
				}
				repo.CreateCategory(bd.GetDB(), categorie)
			}

			repo.CreateCategory(bd.GetDB(), categorie)
			return
		} else {
			err := "Champs incomplet"
			tools.Log(err)
		}
	} else {
		err := "not connected"
		tools.Log(err)
	}

}
