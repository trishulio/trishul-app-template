ifneq (,$(wildcard app.env))
    include app.env
    export
endif

AWS_ACCOUNT_ID ?= 081212343238
AWS_REGION ?= ca-central-1
AWS_PROFILE ?= engineering
APP_NAME ?= {{ cookiecutter.project_slug }}
REGISTRY ?= $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com
ECR_REPO ?= {{ cookiecutter.project_slug }}
VERSION ?= 1.0.20-SNAPSHOT

.PHONY: login_repo containerize minikube_containerize publish

DOCKER_COMPOSE_AWS := docker-compose -f docker-compose-bin.yml run --rm --remove-orphans -e AWS_PROFILE=$(AWS_PROFILE) -e AWS_REGION=$(AWS_REGION) aws

login_repo:
	@CREDS=$$( AWS_IGNORE_CONFIGURED_ENDPOINT_URLS=true aws sts assume-role --role-arn arn:aws:iam::$(AWS_ACCOUNT_ID):role/SystemAdministrator --role-session-name ECRLoginSession --profile $(AWS_PROFILE) --region $(AWS_REGION) ); \
	AWS_ACCESS_KEY_ID=$$(echo "$$CREDS" | jq -r '.Credentials.AccessKeyId') \
	AWS_SECRET_ACCESS_KEY=$$(echo "$$CREDS" | jq -r '.Credentials.SecretAccessKey') \
	AWS_SESSION_TOKEN=$$(echo "$$CREDS" | jq -r '.Credentials.SessionToken') \
	AWS_IGNORE_CONFIGURED_ENDPOINT_URLS=true \
	aws ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin $(REGISTRY)

containerize: login_repo
	$(DOCKER_COMPOSE_MAVEN) mvn -DskipTests -Dimage=$(REGISTRY)/$(ECR_REPO):$(VERSION) jib:build

minikube_containerize: login_repo
	eval $$(minikube -p minikube docker-env) && ./mvnw -DskipTests compile jib:dockerBuild -Dimage=$(APP_NAME):$(VERSION)

local_containerize: login_repo
	docker system prune -f
	$(DOCKER_COMPOSE_MAVEN) mvn -DskipTests compile jib:dockerBuild -Dimage=$(APP_NAME):$(VERSION)

publish: login_repo
	docker push $(REGISTRY)/$(ECR_REPO):$(VERSION)

set_credentials:
	@CREDS_JSON=$$( AWS_PROFILE=$(AWS_PROFILE) aws sts assume-role --role-arn arn:aws:iam::$(AWS_ACCOUNT_ID):role/SystemAdministrator --role-session-name AWSCliSession ); \
	echo "export AWS_ACCESS_KEY_ID=$$(echo $$CREDS_JSON | jq -r '.Credentials.AccessKeyId')"; \
	echo "export AWS_SECRET_ACCESS_KEY=$$(echo $$CREDS_JSON | jq -r '.Credentials.SecretAccessKey')"; \
	echo "export AWS_SESSION_TOKEN=$$(echo $$CREDS_JSON | jq -r '.Credentials.SessionToken')"
