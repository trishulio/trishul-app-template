.PHONY: login_repo containerize containerize_local publish

DOCKER_COMPOSE_AWS := docker-compose --env-file aws.env -f docker-compose-bin.yml run --rm --remove-orphans aws

login_repo:
	docker login -u AWS -p $$($$(DOCKER_COMPOSE_AWS) --region ${AWS_REGION} ecr get-login-password) ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${APP_NAME}

containerize:
	docker build . -t ${APP_NAME}:${VERSION}

containerize_local:
	minikube image build -t ${APP_NAME}:${VERSION} .

publish:
	docker push ${REGISTRY}/${APP_NAME}:${VERSION}

## Helpers - Need to execute manually
set_credentials:
	CREDS_JSON=$$($$(DOCKER_COMPOSE_AWS) sts assume-role --role-arn arn:aws:iam::${AWS_ACCOUNT_ID}:role/SystemAdministrator --role-session-name AWSCliSession);\
	export AWS_ACCESS_KEY_ID=$(echo $CREDS_JSON | jq -r '.Credentials''.AccessKeyId');\
	export AWS_SECRET_ACCESS_KEY=$(echo $CREDS_JSON | jq -r '.Credentials''.SecretAccessKey');\
	export AWS_SESSION_TOKEN=$(echo $CREDS_JSON | jq -r '.Credentials''.SessionToken');
