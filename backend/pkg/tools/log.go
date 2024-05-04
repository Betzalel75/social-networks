package tools

import (
	"fmt"
	"log"
	"path/filepath"
	"runtime"
)

/*----------------------------------------------------------------/
=============== Affichage de l'erreur avec sa source =============
/----------------------------------------------------------------*/

func Log(err interface{}) {
	_, file, line, _ := runtime.Caller(1)
	absPath, _ := filepath.Abs(file)

	log.Printf("\033[31;1mError:\033[0m %v\n Source: \033[34;1m%s\033[0m\t:\033[32m%d\033[0m\n", err, absPath, line)
}

func Debogage(err interface{}) {
	// Obtenez le numéro de ligne en utilisant Caller.
	_, file, line, _ := runtime.Caller(1)
	absPath, _ := filepath.Abs(file)

	fmt.Printf("\033[32;1mDebogage:\033[0m %v\n Source: \033[34;1m%s\033[0m\t:\033[32m%d\033[0m\n", err, absPath, line)
}
