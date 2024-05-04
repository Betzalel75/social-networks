package bd

import (
	"forum/pkg/tools"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/sqlite"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

// dbURL: ../backend/pkg/db/sqlite/forum.sqlite
// migrationsPath: ../backend/pkg/db/migrations/sqlite/
func (db *DB) ApplyMigrations(dbURL, migrationsPath string) error {

	m, err := migrate.New(
		"file://"+migrationsPath,
		"sqlite://"+dbURL,
	)
	if err != nil {
		tools.Log(err)
		return err
	}

	err = m.Up()
	if err != nil && err != migrate.ErrNoChange {
		tools.Log(err)
		return err
	}

	return nil
}
