.PHONY: install compile

DOCKER_COMPOSE_MAVEN := docker-compose --env-file mvn.env -f docker-compose-bin.yml run --rm --remove-orphans mvn
THREADS ?= 2C

ifeq ($(firstword $(MAKECMDGOALS)),maven)
  MAVEN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  # Turn the arguments into do-nothing targets so Make doesn't complain
  $(eval $(MAVEN_ARGS):;@:)
endif

maven:
	$(DOCKER_COMPOSE_MAVEN) mvn $(MAVEN_ARGS)

install:
	$(DOCKER_COMPOSE_MAVEN) mvn clean install -T $(THREADS)

compile:
	$(DOCKER_COMPOSE_MAVEN) mvn compile -q -T $(THREADS)

dependency_tree:
	$(DOCKER_COMPOSE_MAVEN) mvn dependency:tree