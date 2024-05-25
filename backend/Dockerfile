# Dockerfile for NestJS

# Stage 1: Build
FROM node:18 AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# Stage 2: Run
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3001
CMD ["yarn", "start"]