package tools

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"errors"
	model "forum/pkg/internal/models"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gofrs/uuid"
)

func NeewId() string {
	id, err := uuid.NewV4()
	if err != nil {
		Log(err)
		log.Panicln(err)
	}
	return id.String()
}

func UploadFile(id string, data model.File) (string, error) {

	if data.Size > 800*1024 {
		return "Image too large", errors.New("error")
	}

	/// Vérifier si le fichier est une image
	ext := filepath.Ext(data.Name)
	if ext != ".jpg" && ext != ".png" && ext != ".svg" && ext != ".gif" && ext != ".jpeg" {
		return "Non-authorized file format. Ex: .jpg, .svg, .gif, .jpeg", errors.New("error")
	}

	// Créer un nouveau nom pour le fichier
	newFilename := id + ext

	// Stocker le fichier dans un dossier avec le nouveau nom
	dst, err := os.Create("../frontend/src/assets/images/" + newFilename)
	if err != nil {
		Log(err)
		return "unable to download file", err
	}
	defer dst.Close()

	// Ouvrir le fichier à partir des données JSON
	file, err := base64.StdEncoding.DecodeString(data.Data)
	if err != nil {
		Log(err)
		return "unable to decode file", err
	}

	// Copier le contenu du fichier vers le fichier de destination
	_, err = io.Copy(dst, bytes.NewReader(file))
	if err != nil {
		Log(err)
		return "unable to download file", err
	}

	return newFilename, nil
}

var (
	Error *log.Logger
)

func Init() {
	file, err := os.OpenFile("errors.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalln("Failed to open error log file:", err)
	}

	Error = log.New(file,
		"ERROR: ",
		log.Ldate|log.Ltime|log.Lshortfile)
}

func LogErr(err error) {
	if err != nil {
		Error.Println("\033[31m", err.Error(), "\033[0m")
	}
}

// La fonction responseJSON utilise la réponse http.ResponseWriter pour envoyer une réponse JSON.
func ResponseJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func UploadAvatar(w http.ResponseWriter, r *http.Request, name, id string) (string, error) {
	// Vérifiez si la taille du fichier est inférieure à 800KB
	if r.ContentLength > 800*1024 {
		return "Image too large", errors.New("error")
	}
	// Récupérez le fichier à partir de la requête
	file, header, err := r.FormFile(name)
	if err != nil {
		Log(err)
		return "", nil
	}
	defer file.Close()
	// Vérifiez si le fichier est une image
	ext := filepath.Ext(header.Filename)
	if ext != ".jpg" && ext != ".png" && ext != ".svg" && ext != ".gif" && ext != ".jpeg" {
		return "Non-authorized file format. Ex: .jpg, .svg, .gif, .jpeg", errors.New("non-authorized file format. Ex: .jpg, .svg, .gif, .jpeg")
	}
	// Créez un nouveau nom pour le fichier
	newFilename := id + ext
	// Stockez le fichier dans un dossier avec le nouveau nom
	dst, err := os.Create("../frontend/src/assets/images/" + newFilename)
	if err != nil {
		return "unable to download file", errors.New("unable to download file")
	}
	defer dst.Close()
	if _, err := io.Copy(dst, file); err != nil {
		return "unable to download file", errors.New("unable to download file")
	}
	return newFilename, nil
}

// validBirth vérifie si la personne est âgée d'au moins 10 ans.
func ValidBirth(dateNaissance time.Time) bool {
	dateActuelle := time.Now()
	age := dateActuelle.Year() - dateNaissance.Year()
	m := int(dateActuelle.Month()) - int(dateNaissance.Month())
	if m < 0 || (m == 0 && dateActuelle.Day() < dateNaissance.Day()) {
		age-- // Si la personne n'a pas encore eu son anniversaire cette année, soustraire 1 de l'âge
	}
	if age >= 10 {
		return true
	}
	return false
}

func ValidEventDate(date time.Time) bool {
	dateActuelle := time.Now()
	// Vérifier si la date est dans le passé
	return !date.Before(dateActuelle)
}
