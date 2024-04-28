# PROJET FORUM

## Description

Ce projet est un forum web qui permet la communication entre utilisateurs. Les utilisateurs peuvent créer des posts, les associer à des catégories, aimer et ne pas aimer les posts et les commentaires, et filtrer les posts.

## Fonctionnalités

- Communication entre utilisateurs
- Association de catégories aux posts
- Possibilité d'aimer et de ne pas aimer les posts et les commentaires
- Filtrage des posts

## Technologies Utilisées

- Go
- SQLite
- Docker

## Installation

### Using Docker

1. Clonez ce dépôt sur votre machine locale.
2. Assurez-vous que Docker est installé sur votre machine.
3. Construisez l'image Docker en utilisant la commande `docker image build -f Dockerfile -t name_of_the_image .`
4. Exécutez l'application avec ` docker run -p 8080:8080 name_of_the_image`

### Using Script

1. Lancez le script en utilisant la commande ` sudo make build `
2. Exécutez l'application avec ` sudo make run `

## Utilisation

Ouvrez votre navigateur web et accédez à `http://localhost:8080`.

## Contribution

Les contributions sont les bienvenues. Veuillez créer une issue pour discuter des modifications proposées avant de faire une pull request.
Sound Effect by <a href="https://pixabay.com/fr/users/u_03k5gu83c1-32011299/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=129007">u_03k5gu83c1</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=129007">Pixabay</a>

## Licence

MIT
