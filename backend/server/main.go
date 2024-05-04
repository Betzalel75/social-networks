package main

import (
	cmd "forum/cmd"
	bd "forum/pkg/db/sqlite"
	"forum/pkg/tools"
)

func main() {
	db, err := bd.InitDB()
	if err != nil {
		tools.Log(err)
		return
	}
	defer bd.GetDB().Close()
	err = db.ApplyMigrations(dbURL, migrationsPath)
	if err != nil {
		tools.Log(err)
		return
	}
	cmd.Start()
}

var dbURL = "../backend/pkg/db/sqlite/forum.sqlite"
var migrationsPath = "../backend/pkg/db/migrations/sqlite/"
