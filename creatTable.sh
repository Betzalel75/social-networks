#!/bin/bash

# Nom du dossier de migration
MIGRATIONS_DIR="backend/pkg/db/migrations/sqlite"

# Créer le dossier de migration s'il n'existe pas déjà
mkdir -p $MIGRATIONS_DIR

# Fonctions de création de table dans le code Go
TABLE_CREATION_FUNCTIONS=(
    create_categories_table
    create_follow_table
    create_comments_table
    create_likes_table
    create_posts_table
    create_users_table
    create_sessions_table
    create_messages_table
    create_event_table
    create_event_members_table
    create_groups_table
    create_keys_table
    create_notifications_table
    create_user_key_table
    create_group_posts_table
)

# Parcourir toutes les fonctions de création de table
for FUNCTION_NAME in "${TABLE_CREATION_FUNCTIONS[@]}"
do
    # Nom du fichier de migration up
    MIGRATION_FILE_UP="$MIGRATIONS_DIR/$(date +'%Y%m%d%H%M%S')_$FUNCTION_NAME.up.sql"
    # Nom du fichier de migration down
    MIGRATION_FILE_DOWN="$MIGRATIONS_DIR/$(date +'%Y%m%d%H%M%S')_$FUNCTION_NAME.down.sql"

    # Créer le fichier de migration up vide
    touch $MIGRATION_FILE_UP

    # Créer le fichier de migration down vide
    touch $MIGRATION_FILE_DOWN

done
