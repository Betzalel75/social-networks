package main

import (
	"fmt"
	"os/exec"
	"os/user"
	"strings"
)

func repositoryPath(repository string) (string, error) {
	// Obtenir le nom d'utilisateur actuel
	usr, err := user.Current()
	if err != nil {
		return "", fmt.Errorf("error getting current user: %v", err)
	}

	// Construire la commande avec le nom d'utilisateur dynamique
	cmd := exec.Command("find", usr.HomeDir, "-type", "d", "-name", repository)

	// Exécuter la commande et capturer la sortie
	output, err := cmd.Output()
	if err != nil {
		return "", fmt.Errorf("error: %v", err)
	}

	// Convertir la sortie en chaîne et l'afficher
	return strings.TrimSpace(string(output)), nil
}
