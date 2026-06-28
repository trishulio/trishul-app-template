.PHONY: install compile

DOCKER_COMPOSE_MAVEN := docker-compose --env-file mvn.env -f docker-compose-bin.yml run --rm --remove-orphans mvn
THREADS ?= 2C

install:
	$(DOCKER_COMPOSE_MAVEN) mvn clean install -T $(THREADS)

compile:
	$(DOCKER_COMPOSE_MAVEN) mvn compile -q -T $(THREADS)

dependency_tree:
	$(DOCKER_COMPOSE_MAVEN) mvn dependency:tree