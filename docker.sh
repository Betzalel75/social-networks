docker rmi -f $(docker images -aq)
docker-compose down
docker-compose up --build