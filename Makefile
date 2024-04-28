# Makefile for building and managing Docker image

# Variables
IMAGE_NAME = forum
DOCKERFILE = Dockerfile

.PHONY: build run

# Build Docker image
build:
	docker image build -f $(DOCKERFILE) -t $(IMAGE_NAME) .

# Run Docker container
run:
	docker run -p 8080:8080 $(IMAGE_NAME)

# Usage: make [target]
