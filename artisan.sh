#!/bin/bash

# Nom du dossier de migration
MIGRATIONS_DIR="backend/pkg/db/migrations/sqlite"

# Créer le dossier de migration s'il n'existe pas déjà
mkdir -p $MIGRATIONS_DIR

# Vérifier si des arguments ont été fournis
if [ $# -eq 0 ]; then
    echo "Aucun nom de table spécifié. Veuillez fournir des noms de tables en paramètres."
    echo "Ex: ./create_migrations.sh create_categories_table"
    exit 1
fi

# Initialiser le compteur
i=1

# Parcourir les noms de tables fournis en paramètres
for TABLE_NAME in "$@"; do
    # Nom du fichier de migration
    MIGRATION_FILE="$MIGRATIONS_DIR/$(date +'%Y%m%d%H%M%S')_${i}_create_$TABLE_NAME${_table}.up.sql"

    # Créer le fichier de migration vide
    touch $MIGRATION_FILE
    # Incrémenter le compteur
    i=$((i + 1))
    # Afficher le chemin du fichier de migration créé
    echo "Fichier de migration créé : $MIGRATION_FILE"
done
