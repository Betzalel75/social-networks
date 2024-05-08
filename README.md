# PROJET SOCIAL-NETWORK

## Description

Ce projet est un réseau social qui permet la communication entre utilisateurs. Les utilisateurs peuvent créer des posts, les associer à des catégories, aimer et ne pas aimer les posts et les commentaires, et filtrer les posts. Créer des groupes de dans lesquels ils peuvent faire les mêmes actions: Toutefois seuls les membres du groupe pouront les voir et y réagire.
Les utilisateurs peuvent chater entre eux ou a travers un groupe.

## Fonctionnalités

- Communication entre utilisateurs
- Association de catégories aux posts
- Possibilité d'aimer et de ne pas aimer les posts et les commentaires
- Filtrage des posts
- Créer des Groupes
- Rendre son Profil Privé ou Public

## Technologies Utilisées

- Go
- SQLite
- Docker
- JavaScript

## Installation

### Using Docker

1. Clonez ce dépôt sur votre machine locale.
   ```bash
   git clone https://learn.zone01dakar.sn/git/moustapndiaye/social-network.git
   ```
2. Assurez-vous que Docker est installé sur votre machine.
3. Construisez l'image Docker en utilisant la commande `bash docker.sh`
4. L'application se lance automatiquement à la fin de la construction des images


## Utilisation

Ouvrez deux terminals

### Dans le cas du serveur backend.

Déplacez vous dans le répertoire `backend` avec la commande.
```bash
   cd backend
```
Executer la commande suivante pour lancer le serveur backend
```bash
   go run ./server
```

### Dans le cas du serveur frontend.

Déplacez vous dans le répertoire `frontend` avec la commande.
```bash
   cd frontend
```
Executer la commande suivante pour mettre à jour les packages du frontend
```bash
   npm install
```
Executer la commande suivante pour lancer le serveur frontend
```bash
   npm run dev
```

Ouvrez votre navigateur web et accédez à `http://localhost:3000"` ou un autre lien proposer automatiquement par le serveur Frontend.

## Contribution

Les contributions sont les bienvenues. Veuillez créer une issue pour discuter des modifications proposées avant de faire une pull request.
Sound Effect by <a href="https://pixabay.com/fr/users/u_03k5gu83c1-32011299/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=129007">u_03k5gu83c1</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=129007">Pixabay</a>

## LICENSE
Ce projet est sous licence [MIT](LICENSE).
