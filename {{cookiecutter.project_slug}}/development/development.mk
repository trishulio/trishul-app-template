.PHONY: development development-reset development-restart

DOCKER_COMPOSE_DEVELOPMENT := docker-compose --env-file development.env -f docker-compose-development.yml

development-up:
	$(DOCKER_COMPOSE_DEVELOPMENT) up -d

development-down:
	$(DOCKER_COMPOSE_DEVELOPMENT) down

development-restart:
	$(DOCKER_COMPOSE_DEVELOPMENT) down && \
	$(DOCKER_COMPOSE_DEVELOPMENT) rm && \
	$(DOCKER_COMPOSE_DEVELOPMENT) up -d

development-reset:
	$(DOCKER_COMPOSE_DEVELOPMENT) down -v && \
	$(DOCKER_COMPOSE_DEVELOPMENT) rm && \
	$(DOCKER_COMPOSE_DEVELOPMENT) up -d
