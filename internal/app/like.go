package app

import (
	"database/sql"
	"fmt"
	"log"

	bd "forum/internal/database"
	repo "forum/internal/database/repository"
	model "forum/internal/models"
	"forum/internal/tools"
)

type FeedbackRequest struct {
	PostID string `json:"postId"`
	Action string `json:"action"`
	Cookie string `json:"cookie"`
}

type FeedbackResponse struct {
	LikeCount    int `json:"likeCount"`
	DislikeCount int `json:"dislikeCount"`
}

func AddLike(useID, ID, name string, typ int) {
	if typ != 1 && typ != -1 {
		err := "error like value"
		tools.Log(err)
		log.Fatal("error like value")
	}
	// verify if the user already like/dislike the post
	like, err := repo.GetLikeByPostAndUserID(bd.GetDB(), useID, ID, name)
	if err != nil {
		// if not exist like/dislake we create it
		if err == sql.ErrNoRows {
			l := model.Like{
				LikeID: tools.NeewId(),
				UserID: useID,
				Type:   typ,
			}
			if name == "post_id" {
				l.PostID = ID
				l.CommentID = ""
			}
			if name == "comment_id" {
				l.CommentID = ID
				l.PostID = ""
			}
			repo.CreateLike(bd.GetDB(), l)
			return
		}
		tools.LogErr(err)
		tools.Log(err)
		return
	}

	// if exist like/dislake we upgrade it
	if (typ == 1 && like.Type == -1) || (typ == 1 && like.Type == 0) {
		// fmt.Println(typ, like.Type)
		repo.UpdateLikeType(bd.GetDB(), like.LikeID, typ)
	} else if typ == -1 && like.Type == 1 || (typ == -1 && like.Type == 0) {
		// fmt.Println(typ, like.Type)
		repo.UpdateLikeType(bd.GetDB(), like.LikeID, typ)
	} else if typ == like.Type {
		// fmt.Println(typ, like.Type)
		repo.UpdateLikeType(bd.GetDB(), like.LikeID, 0)
	}
}

func PerformAction(cookie, ID, name string, action string) FeedbackResponse {
	user, err := repo.GetUserIDBySession(bd.GetDB(), cookie)
	if err != nil {
		tools.LogErr(err)
		tools.Log(err)
		return FeedbackResponse{}
	}
	switch action {
	case "like":
		AddLike(user, ID, name, 1)
	case "dislike":
		AddLike(user, ID, name, -1)
	default:
		fmt.Println("action inconnue")
	}
	like, dislike, err := repo.CountLikes(bd.GetDB(), name, ID)
	if err != nil {
		tools.LogErr(err)
		tools.Log(err)
		return FeedbackResponse{}
	}
	counts := FeedbackResponse{
		LikeCount:    like,
		DislikeCount: dislike,
	}
	return counts
}

func InitPostAndCommentLikeAndDislike(posts []model.Post) []model.Post {
	for i, post := range posts {
		like, dislike, err := repo.CountLikes(bd.GetDB(), "post_id", post.PostID)
		if err != nil {
			tools.LogErr(err)
			tools.Log(err)
			return []model.Post{}
		}
		comments, err := repo.GetCommentsByPost(bd.GetDB(), post.PostID)
		if err != nil {
			tools.LogErr(err)
			tools.Log(err)
			return []model.Post{}
		}
		
		user, err := repo.GetUserByID(bd.GetDB(), post.UserID)
		if err != nil {
			tools.LogErr(err)
			tools.Log(err)
			return []model.Post{}
		}
		post.Photo = user.Photo
		post.Name = user.FirstName
		post.LikeCount = like
		post.DislikeCount = dislike
		post.CommentCount = len(comments)
		for j, comment := range comments {
			like, dislike, err := repo.CountLikes(bd.GetDB(), "comment_id", comment.CommentID)
			if err != nil {
				tools.LogErr(err)
				tools.Log(err)
				return []model.Post{}
			}
			user, err := repo.GetUserByID(bd.GetDB(), comment.UserID)
			if err != nil {
				tools.LogErr(err)
				tools.Log(err)
				return []model.Post{}
			}
			comment.LikeNbr = like
			comment.DislikeNbr = dislike
			comment.Name = user.FirstName
			comment.Photo = user.Photo
			comment.UserID = ""
			comments[j] = comment
		}
		post.Comment = comments
		post.UserID = ""
		posts[i] = post
	}

	return posts
}
