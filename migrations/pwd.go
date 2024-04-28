package main

import (
    "fmt"
    "os"
    "path/filepath"
)

// findParentDir parcourt les dossiers parents jusqu'à trouver celui dont le nom correspond à targetDirName.
// Retourne le chemin complet du dossier parent trouvé, ou une erreur si le dossier n'est pas trouvé.
func findParentDir(targetDirName string) (string, error) {
    currentDir, err := os.Getwd()
    if err != nil {
        return "", fmt.Errorf("erreur lors de l'obtention du répertoire courant : %w", err)
    }

    for {
        parentDir := filepath.Dir(currentDir)
        if parentDir == currentDir {
            return "", fmt.Errorf("dossier parent '%s' non trouvé", targetDirName)
        }
        if filepath.Base(parentDir) == targetDirName {
            return parentDir, nil
        }
        currentDir = parentDir
    }
}
