package app

import (
	bd "forum/pkg/db/sqlite"
	repo "forum/pkg/db/sqlite/repository"
	model "forum/pkg/internal/models"
	"forum/pkg/tools"
	"log"
)

func AddComment(postID, comment, submit, senderId string, commentId, image string) {

	if postID != "" && comment != "" && submit == "Add comment" {
		comments := model.Comment{
			CommentID: commentId,
			UserID:    senderId,
			PostID:    postID,
			Content:   comment,
			Image:     image,
		}
		er := repo.CreateComment(bd.GetDB(), comments)
		if er != nil {
			tools.Log(er)
			return
		}
	} else {
		log.Println("il y a un truc qui n'a pas fonctionner")
	}
}
