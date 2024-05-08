package app

import (
	"database/sql"
	bd "forum/pkg/db/sqlite"
	repo "forum/pkg/db/sqlite/repository"
	model "forum/pkg/internal/models"
	"forum/pkg/tools"
	"log"
)

func AddComment(postID, comment, submit, senderId string, commentId, image string) {

	if postID != "" && submit == "Add comment" {
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
		log.Println("il y a un truc qui n'a pas fonctionner dans la creation du commentaire")
	}
}

// Get comment By PostID
func CommentsToPost(bd *sql.DB, post model.Post) []model.Comment {
	comments, err := repo.GetCommentsByPost(bd, post.PostID)
	if err != nil {
		tools.Log(err)
		return []model.Comment{}
	}

	// post.CommentCount = len(comments)
	for j, comment := range comments {
		like, dislike, err := repo.CountLikes(bd, "comment_id", comment.CommentID)
		if err != nil {
			tools.Log(err)
			return []model.Comment{}
		}
		user, err := repo.GetUserByID(bd, comment.UserID)
		if err != nil {
			tools.Log(err)
			return []model.Comment{}
		}
		comment.LikeNbr = like
		comment.DislikeNbr = dislike
		comment.Name = user.FirstName
		comment.Photo = user.Photo
		comment.UserID = ""
		comments[j] = comment
	}
	return comments
}
