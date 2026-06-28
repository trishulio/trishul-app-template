.PHONY: run

DOCKER_COMPOSE_APP := docker-compose --env-file app.env -f docker-compose.yml -f docker-compose-dev.yml

app-run:
	$(DOCKER_COMPOSE_APP) up

app-down:
	$(DOCKER_COMPOSE_APP) down

app-restart:
	$(DOCKER_COMPOSE_APP) restart

app-prune:
	$(DOCKER_COMPOSE_APP) down &&\
	$(DOCKER_COMPOSE_APP) rm -v

app-reset: app-down install app-run
