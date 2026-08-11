.PHONY: deploy undeploy

APP_NAME:={{ cookiecutter.project_slug }}
VERSION:=1.0.20-SNAPSHOT
VALUES_FILE:=values-$(ENV_NAME).yml
APP_NAME_PREFIX:=$(shell awk '/^app:/ {flag=1; next} /^[^ ]/ {flag=0} flag && /^  name:/ {print $$2}' chart/values.yaml)
ENV_NAME:=$(shell awk '/^env:/ {print $$2}' chart/$(VALUES_FILE))
NAMESPACE:=$(APP_NAME_PREFIX)-$(ENV_NAME)

## TODO: Change this to deployment and calculate values-file, and namespace from it.

DOCKER_COMPOSE_HELM := docker-compose -f ../docker-compose-bin.yml run --rm --remove-orphans helm

deploy:
	(cd chart && ${DOCKER_COMPOSE_HELM} upgrade --install -f values.yaml -f ${VALUES_FILE} -n ${NAMESPACE} ${APP_NAME} . --set image.tag=${VERSION})

undeploy:
	(cd chart && ${DOCKER_COMPOSE_HELM} uninstall -n ${NAMESPACE} ${APP_NAME})
