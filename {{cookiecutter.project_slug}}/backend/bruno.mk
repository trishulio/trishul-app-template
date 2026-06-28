.PHONY: generate-collection

DOCKER_COMPOSE_BRUNO := docker-compose --env-file bruno.env -f bruno/docker-compose.yml run --rm bruno

generate-collection:
	rm -rf bruno-collection
	$(DOCKER_COMPOSE_BRUNO) bru import openapi -s api/openapi.json -o bruno-collection -n "{{cookiecutter.project_name}} API" --collection-format bru
	$(DOCKER_COMPOSE_BRUNO) node bruno/scripts/bruno-post-process.js
