# Utiliser l'image officielle de Node.js comme base
FROM node:latest AS builder

# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /frontend

# Copier les fichiers Vue.js nécessaires
COPY . .

# Installer les dépendances
RUN npm install 

# Exposer le port sur lequel Nginx s'exécute
EXPOSE 3000

CMD [ "npm", "run", "dev" ]
