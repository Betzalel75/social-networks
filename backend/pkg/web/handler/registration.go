package handler

import (
	"database/sql"
	"errors"
	bd "forum/pkg/db/sqlite"
	repo "forum/pkg/db/sqlite/repository"
	"forum/pkg/internal/app"
	model "forum/pkg/internal/models"
	"forum/pkg/tools"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/gofrs/uuid"
	"golang.org/x/crypto/bcrypt"
)

/*
----------------------------------------------------/

	================ REGISTRATION =================

/----------------------------------------------------
*/
func validEmail(email string) bool {
	if email == "" {
		return false // Returns false if the email is empty
	}
	emailRegexp := regexp.MustCompile(`^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-z]{2,10}$`)
	return emailRegexp.MatchString(email) // Returns true if the email matches the pattern
}

func registration(w http.ResponseWriter, r *http.Request, username, email, password, age, firstName, lastName, about string) {

	dateNaissance, err := time.Parse("2006-01-02", age)
	if err != nil {
		data := map[string]interface{}{
			"code":    http.StatusInternalServerError,
			"message": "Internal Server Error",
		}
		tools.ResponseJSON(w, http.StatusInternalServerError, data)
		tools.Log(err)
		return
	}

	email = strings.TrimSpace(email)

	if email == "" || age == "" || firstName == "" || lastName == "" || !tools.ValidBirth(dateNaissance) {
		tools.Log("username " + username + " email " + email + " password " + password + " firstname " + firstName + " lastname " + lastName + " age " + age + " gender " + about)
		err := "all fields are required"
		tools.Log(err)
		tools.ResponseJSON(w, http.StatusBadRequest, err)
		return
	}

	if !validEmail(email) {
		err := "Invalid email"
		tools.Log(err)
		tools.ResponseJSON(w, http.StatusBadRequest, err)
		return
	}

	valid := strings.Split(email, "@")
	if len(valid) != 2 || valid[0] == "" || valid[1] == "" {
		err := "incorrect email format"
		tools.Log(err)
		tools.ResponseJSON(w, http.StatusBadRequest, err)
		return
	}

	if len(password) < 4 {
		err := "password too short"
		tools.Log(err)
		tools.ResponseJSON(w, http.StatusBadRequest, err)
		return
	}
	_, exist := repo.GetUserByEmail(bd.GetDB(), email)
	_, existant := repo.GetUserByNickName(bd.GetDB(), username)
	if username == "" {
		existant = errors.New("error")
	}
	// fmt.Println(exist, existant)
	if exist == sql.ErrNoRows && existant != nil {
		pwd, err := passwordCrypt(password)
		if err != nil {

			tools.Log(err)
			tools.ResponseJSON(w, http.StatusBadRequest, err)
			return
		}
		id, err := uuid.NewV4()
		if err != nil {

			tools.Log(err)
			tools.ResponseJSON(w, http.StatusBadRequest, err)
			return
		}
		userID := id.String()
		image := "defautl.jpg"
		// Image de Profile
		file, _, _ := r.FormFile("postimage")
		if file != nil {
			img, err := tools.UploadAvatar(w, r, "postimage", userID)
			if err != nil {
				tools.Log(err)
				tools.ResponseJSON(w, http.StatusBadRequest, err)
				return
			}

			if img != "" {
				image = img
			}
		}
		//----------------------------------------------------------------
		user := model.User{
			UserID:       userID,
			FirstName:    firstName,
			LastName:     lastName,
			About:        about,
			Age:          age,
			Username:     username,
			Email:        email,
			Password:     pwd,
			Photo:        image,
			StatusProfil: "public",
		}
		repo.CreateUser(bd.GetDB(), user)
		cookie := app.SetCookie(w, r, user.UserID)

		datas := returnData(r, cookie.Value)
		response := map[string]interface{}{
			"success":  true,
			"message":  "Authentication successful",
			"redirect": "/forum",
			"cookie":   cookie.Value,
			"datas":    datas,
		}
		tools.ResponseJSON(w, http.StatusOK, response)
		return
	}

	if existant == nil {
		err := "nickname already exists"
		tools.Log(err)
		tools.ResponseJSON(w, http.StatusBadRequest, err)
		return
	}

	errs := "email already exists"
	tools.Log(errs)
	tools.ResponseJSON(w, http.StatusBadRequest, errs)
}

func passwordCrypt(password string) (string, error) {
	pwd, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {

		tools.Log(err)
	}
	return string(pwd), nil
}
