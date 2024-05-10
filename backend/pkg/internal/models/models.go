package model

import (
	"database/sql"
	"time"
)

type Erreur struct {
	Code    int
	Message string
}

type Set struct {
	Status  string
	Message string
	User    User
}

type Loginfo struct {
	Status  string
	Message string
}

type PageInfo struct {
	Name      string
	Photo     string
	Posts     []Post
	AllUser   []Connection
	History   []Message
	Connected bool
}

type Group struct {
	GroupId    string
	GroupTitle string
	GroupDesc  string
	GroupOwner string
	GroupUsers string
	Type       string    `json:"type"`
	CreatedAt  time.Time // Timestamp
}

// DataStructure représente la structure globale contenant toutes les données nécessaires
type DataStructure struct {
	IdUser       string
	Publish      PageInfo
	PostsProfile PageInfo
	Infolog      Loginfo
	Sets         Set
	Suggession   []Connection
}

type Connection struct {
	UserID  string
	Name    string
	Photo   string
	Status  string
	History []Message
}

// User represents a user in the database
type User struct {
	UserID       string // Primary Key
	LastName     string // last name
	FirstName    string // first name
	About        string // gender
	Age          string // age
	Username     string
	Email        string
	Photo        string
	Password     string // encrypted
	Date         time.Time
	Key          string
	StatusProfil string
}

type Follow struct {
	FollowID     string // Primary Key
	UserID       string // Foreign Key, references User entity
	FollowedUser string `json:"followedUserName"`
	FollowType   string `json:"followType"`
	Cookie       string `json:"cookie"`
}

// Category represents a category in the database
type Category struct {
	CategoryID string // Primary Key
	PostID     string // Primary Key
	Name       string
}

// Post represents a post in the database
type Post struct {
	PostID       string // Primary Key
	GroupID      string // Primary Key
	UserID       string // Foreign Key, references User entity
	Title        string
	Content      string
	Image        string
	Photo        string
	Name         string
	LikeCount    int
	DislikeCount int
	CommentCount int
	Comment      []Comment
	CreatedAt    time.Time    // Timestamp
	Private      sql.NullBool // true if private false default
}

// Comment represents a comment in the database
type Comment struct {
	CommentID  string // Primary Key
	UserID     string // Foreign Key, references User entity
	PostID     string // Foreign Key, references Post entity
	Content    string
	Photo      string
	Image      string
	Name       string
	LikeNbr    int
	DislikeNbr int
}

// Like represents a "Like" or "Dislike" in the database
type Like struct {
	LikeID    string // Primary Key
	UserID    string // Foreign Key, references User entity
	PostID    string // Foreign Key, references Post entity
	CommentID string // Foreign Key, references Comment entity
	Type      int    // 1 for Like, 0 for Dislike
}

type Session struct {
	SessionID string    // Primary Key
	UserID    string    // Foreign Key, references User entity
	Ttl       time.Time // Foreign Key, references User entity
}

type Message struct {
	MessageID  string `json:"idMessage"`  // Primary Key
	SenderID   string `json:"senderID"`   // Foreign Key, references User Sender entity
	ReceiverID string `json:"receiverID"` // Foreign Key, references User Receiver entity
	Content    string `json:"message"`
	Type       string `json:"type"`
	SenderName string `json:"sender"`
	Cookie     string `json:"cookie"`
	CreatedAt  time.Time
	Vu         sql.NullBool
}

// Structure pour représenter un message de commentaire
type CommentMessage struct {
	Type       string `json:"type"`
	UserName   string `json:"userName"`
	PhotoSrc   string `json:"photoSrc"`
	SenderID   string `json:"senderID"` // Foreign Key, references User Sender entity
	PostID     string `json:"postID"`
	CommentID  string `json:"commentID"`
	Comment    string `json:"comment"`
	Submit     string `json:"submit"`
	LikeNbr    int    `json:"LikeNbr"`
	DislikeNbr int    `json:"DislikeNbr"`
	Image      File   `json:"image"`
	Src        string `json:"srcImage"`
}

type Credentials struct {
	Password    string `json:"password"`
	Identifiant string `json:"identifiant"`
	Cookie      string `json:"cookie"`
}

type Settings struct {
	Password    string `json:"password"`
	UserName    string `json:"username"`
	Cookie      string `json:"cookie"`
	Image       File   `json:"image"`
	Email       string `json:"email"`
	NewPassword string `json:"newPassword"`
	Status      string `json:"statusProfil"`
}

type File struct {
	Name               string `json:"name"`
	LastModified       int    `json:"lastModified"`
	LastModifiedDate   string `json:"lastModifiedDate"`
	WebkitRelativePath string `json:"webkitRelativePath"`
	Size               int    `json:"size"`
	Type               string `json:"type"`
	Data               string `json:"content"`
}

type Publications struct {
	Cookie   string   `json:"cookie"`
	Title    string   `json:"title"`
	Desc     string   `json:"desc"`
	Image    File     `json:"image"`
	Publish  string   `json:"publish"`
	Category []string `json:"cat"`
	Private  bool     `json:"private"`
	Type     string   `json:"type"`
	Users    []string `json:"users"`
	GroupID  string   `json:"groupID"`
}

type MessageData struct {
	Cookie        string `json:"cookie"`
	MessageID     string `json:"messageID"`
	NewVisibility bool   `json:"newVisibility"`
}

type Notification struct {
	NotificationID string       `json:"notificationID"`
	UserID         string       `json:"userID"`
	Receiver_id    string       `json:"receiver"`
	Category       string       `json:"category"`
	Type           string       `json:"type"`
	Vu             sql.NullBool `json:"vu"`
	CreatedAt      time.Time    // Timestamp
	GroupID        string       `json:"groupID"`
}

type Key struct {
	KeyID   string `json:"keyID"`
	Key     string `json:"key"`
	UserID  string `json:"userID"`
	Private bool   `json:"private"`
}

type Event struct {
	EventID     string // Primary Key
	UserID      string // Foreign Key, references User entity
	Title       string
	Description string
	Date        string
	Image       string
	GroupID     string
	Members     int
}

type EventMember struct {
	EventMemberID string // Primary Key
	EventID       string // Primary Key
	UserID        string // Foreign Key, references User entity
}
