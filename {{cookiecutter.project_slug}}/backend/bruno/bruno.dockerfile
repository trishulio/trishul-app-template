FROM node:20-alpine
WORKDIR /app/bruno
COPY bruno/package.json bruno/package-lock.json* ./
RUN npm install
WORKDIR /app
RUN npm install -g @usebruno/cli@3.3.0 openapi-sampler

