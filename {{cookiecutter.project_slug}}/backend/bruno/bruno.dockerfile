FROM node:20-alpine
WORKDIR /app
RUN npm install -g @usebruno/cli@3.3.0 openapi-sampler@1.7.2
