package handler

import model "forum/internal/models"

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
