package handler

import (
	"database/sql"
	repo "forum/pkg/db/sqlite/repository"
	model "forum/pkg/internal/models"
	"forum/pkg/tools"
)

// CustomSortByDate trie les posts par ordre de création décroissant.
type CustomSortByDate []model.Post

func (a CustomSortByDate) Len() int {
	return len(a)
}

func (a CustomSortByDate) Swap(i, j int) {
	a[i], a[j] = a[j], a[i]
}

func (a CustomSortByDate) Less(i, j int) bool {
	return a[i].CreatedAt.After(a[j].CreatedAt)
}

// Supprimer les clés d'un utilisateur lorsqu'il cesse de suivre un autre utilisateur
func removeUserKeysWhenUnfollow(bd *sql.DB, userID, followerID string) error {
	// Récupérer toutes les clés de l'utilisateur suivi
	keys, err := repo.GetAllPrivateKeysByUserID(bd, userID)
	if err != nil {
		tools.Log(err)
		return err
	}
	
	// Récupérer toutes les clés de l'utilisateur
	followedKeys, err := repo.GetAllKeysByUserID(bd, followerID)
	if err != nil {
		tools.Log(err)
		return err
	}

	// Créer un map pour stocker les ID de clé à supprimer
	keysToDelete := make(map[string]bool)

	// Identifier les clés à supprimer
	for _, key := range keys {
		for _, followedKey := range followedKeys {
			if key.KeyID == followedKey.KeyID {
				keysToDelete[key.KeyID] = true
				break // On ne vérifie pas d'autres clés si on en trouve une correspondante
			}
		}
	}

	// Supprimer les clés identifiées
	for keyID := range keysToDelete {
		if err := repo.DeleteKeysBykeyID(bd, keyID); err != nil {
			tools.Log(err)
			return err
		}
	}

	return nil
}
