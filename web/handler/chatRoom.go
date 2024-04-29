package handler



func (room *Room) GetId() string {
	return room.ID.String()
}

func (room *Room) GetName() string {
	return room.Name
}

func (server *WsServer) findRoomByName(name string) *Room {
	var foundRoom *Room
	for room := range server.rooms {
		if room.GetName() == name {
			foundRoom = room
			break
		}
	}

	return foundRoom
}

func (server *WsServer) createRoom(name string) *Room {
	room := NewRoom(name)
	go room.RunRoom()
	server.rooms[room] = true

	return room
}


func (server *WsServer) findRoomByID(ID string) *Room {
	var foundRoom *Room
	for room := range server.rooms {
		if room.GetId() == ID {
			foundRoom = room
			break
		}
	}

	return foundRoom
}