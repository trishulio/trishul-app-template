.PHONY: install compile

MAVEN := docker-compose --env-file mvn.env -f docker-compose-bin.yml run --rm --remove-orphans mvn
THREADS ?= 2C

install:
	$(MAVEN) mvn clean install -T $(THREADS)

compile:
	$(MAVEN) mvn compile -q -T $(THREADS)

dependency_tree:
	$(MAVEN) mvn dependency:tree