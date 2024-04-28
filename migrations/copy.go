package main

import (
	"database/sql"
	"forum/internal/tools"
)

func clone(src, dest *sql.DB) {
	if exists, err := migrationAlreadyDone(dest, "users"); err != nil {
		panic(err)
	} else if !exists {
		migrationUsers(src, dest)
	} else {
		tools.Debogage("Migration users already done")
	}

	if exists, err := migrationAlreadyDone(dest, "messages"); err != nil {
		panic(err)
	} else if !exists {
		migrationMessages(src, dest)
	} else {
		tools.Debogage("migration messages already done")
	}

	if exists, err := migrationAlreadyDone(dest, "comments"); err != nil {
		panic(err)
	} else if !exists {
		migrationComment(src, dest)
	} else {
		tools.Debogage("Migration comments already done")
	}

	if exists, err := migrationAlreadyDone(dest, "posts"); err != nil {
		panic(err)
	} else if !exists {
		migrationPosts(src, dest)
	} else {
		tools.Debogage("migration posts already done")
	}

	if exists, err := migrationAlreadyDone(dest, "likes"); err != nil {
		panic(err)
	} else if !exists {
		migrationLikes(src, dest)
	} else {
		tools.Debogage("migration likes already done")
	}

	if exists, err := migrationAlreadyDone(dest, "categories"); err != nil {
		panic(err)
	} else if !exists {
		migrationCategory(src, dest)
	} else {
		tools.Debogage("migration categories already done")
	}
}
