package main

import (
	"database/sql"
	"fmt"
	bd "forum/internal/database"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	if len(os.Args) != 2 {
		fmt.Println("Usage: go run . [nom_dossier_parent]\nEx: go run . social-network")
		return
	}
	path, err := findParentDir(os.Args[1])
	if err != nil {
		panic(err)
	}
	bd.InitDB(path + "/internal/database/forum.sqlite")
	defer bd.GetDB().Close()

	// Connexion à la base de données source
	src, err := repositoryPath("-social-network")
	if err != nil {
		panic(err)
	}
	sourceDB, err := sql.Open("sqlite3", src+"/internal/database/forum.sqlite")
	if err != nil {
		panic(err)
	}
	defer sourceDB.Close()

	// Connexion à la base de données de destination
	destDB, err := sql.Open("sqlite3", path+"/internal/database/forum.sqlite")
	if err != nil {
		panic(err)
	}
	defer destDB.Close()
	clone(sourceDB, destDB)
}
