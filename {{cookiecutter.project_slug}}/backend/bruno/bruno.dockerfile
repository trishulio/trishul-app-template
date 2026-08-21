FROM node:20-alpine
WORKDIR /app/bruno
COPY bruno/package.json bruno/package-lock.json* ./
RUN npm install
WORKDIR /app