# Utiliser l'image officielle de Golang comme base
FROM golang:latest AS builder

# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /backend

# Copier les fichiers Go nécessaires
COPY . .

# Compiler l'application Go
RUN go build -o main ./server/main.go


# Exposer le port sur lequel votre application Go s'exécute
EXPOSE 8080

# Commande pour démarrer votre application backend
CMD ["./main"]
