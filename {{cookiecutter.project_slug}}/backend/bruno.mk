.PHONY: generate-collection

BRUNO := docker-compose --env-file bruno.env -f bruno/docker-compose.yml run --rm bruno

generate-collection:
	rm -rf bruno-collection
	$(BRUNO) bru import openapi -s api/openapi.json -o bruno-collection -n "{{cookiecutter.project_name}} API" --collection-format bru
	$(BRUNO) node bruno/scripts/bruno-post-process.js
