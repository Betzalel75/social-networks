package app

import (
	bd "forum/internal/database"
	repo "forum/internal/database/repository"
	model "forum/internal/models"
	"forum/internal/tools"
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
