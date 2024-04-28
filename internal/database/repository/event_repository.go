package repo

import (
	"database/sql"
	model "forum/internal/models"
	"forum/internal/tools"
)

//DROP TABLE IF EXISTS
func CreateEvents(db *sql.DB, event model.Event) error {
	insertSQL := `
	   INSERT INTO event (event_id, title, description, image, admin, date, group_id) VALUES (?, ?, ?, ?, ?, ?,?);`
	_, err := db.Exec(insertSQL, &event.EventID, &event.Title, &event.Description, &event.Image, &event.UserID, &event.Date,&event.GroupID)
	return err
}

func GetEventByGroupId(db *sql.DB, idGroup string) ([]model.Event, error) {
	querySQL := `SELECT event_id, title, description, image,admin, date FROM event WHERE group_id = ?;`
	rows, err := db.Query(querySQL,idGroup)
	if err != nil {
		tools.Log(err)
		return nil, err
	}
	defer rows.Close()

	var event []model.Event
	for rows.Next() {
		var e model.Event
		if err := rows.Scan(&e.EventID,&e.Title,&e.Description, &e.Image, &e.UserID, &e.Date); err != nil {
			tools.Log(err)
			return nil, err
		}
		event = append(event, e)
	}

	return event, nil
}
