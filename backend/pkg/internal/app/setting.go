package app

import (
	// "encoding/base64"

	bd "forum/pkg/db/sqlite"
	repo "forum/pkg/db/sqlite/repository"
	model "forum/pkg/internal/models"
	"forum/pkg/tools"
	"net/http"
	"os"

	"golang.org/x/crypto/bcrypt"
)

func UpdateUser(w http.ResponseWriter, r *http.Request, User model.User, data model.Settings) (model.User, string, bool) {
	form := []string{data.UserName, data.Email, data.Password}

	ok := false
	if form[1] != "" {
		return User, "modify unauthorized email", false
	}
	if len(r.FormValue("oldPassword")) != 0 {
		form[2] = r.FormValue("oldPassword")
		ok = true
	}
	if bcrypt.CompareHashAndPassword([]byte(User.Password), []byte(form[2])) == nil {
		if ok && len(data.NewPassword) < 4 {
			return User, "new passeword is ", false
		} else if ok && len(data.NewPassword) > 3 {
			form[2] = data.NewPassword
		}
		pwd, err := passwordCrypt(form[2])
		if err != nil {
			return User, "Unable to modify your new data", false
		}
		image := User.Photo
		if User.Photo != "defautl.jpg" {
			os.Remove("./images/" + User.Photo)
		}
		if data.Image.Name != "" {
			// nb := strings.Split(data.Image.Name, ".")[0]
			img, err := tools.UploadFile(User.UserID, data.Image)
			if err != nil {
				tools.Log(err)
				return User, img, false
			}
			// Utilisez le nom de fichier retourné s'il y a eu un téléchargement réussi
			image = img
		}

		repo.UpdateUser(bd.GetDB(), User.UserID, User.Email, form[0], pwd, image)
		user := User
		info, err := repo.GetUserByID(bd.GetDB(), User.UserID)
		if err != nil {
			return User, "Unable to display your new data", false
		}
		user.FirstName, user.Email, user.Photo = info.FirstName, info.Email, info.Photo
		return user, "successfully modified", true
	}
	return User, "passwords incorrect", false
}
