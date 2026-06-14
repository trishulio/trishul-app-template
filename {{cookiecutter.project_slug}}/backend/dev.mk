.PHONY: run

DEV := docker-compose --env-file app.env -f docker-compose.yml -f docker-compose-dev.yml

app-run:
	$(DEV) up -d &&\
	docker logs -f {{cookiecutter.project_slug}}-backend

app-down:
	$(DEV) down

app-restart:
	$(DEV) restart

app-prune:
	$(DEV) down &&\
	$(DEV) rm -v

app-reset: app-down install app-run
