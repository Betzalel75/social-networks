# Utilisez une image Go officielle comme image parente
FROM golang:1.20-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /forum

# Installer gcc et autres dépendances de compilation
RUN apk add --no-cache gcc g++ make libc-dev

# Copier le reste du code de l'application dans le répertoire de travail du conteneur
COPY cmd ./cmd
COPY internal ./internal
COPY web ./web

# Copier go.mod et go.sum dans le répertoire de travail du conteneur
COPY go.mod go.sum ./

# Télécharger toutes les dépendances
RUN go mod download

# Compiler l'application avec CGO activé
RUN CGO_ENABLED=1 go build -o main ./cmd/main.go

# Exposer le port sur lequel l'application s'exécute
EXPOSE 8080

# Définir la commande pour exécuter l'application
CMD ["./main"]
