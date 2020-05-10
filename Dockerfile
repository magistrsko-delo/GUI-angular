### STAGE 1: Build ###
FROM node:10.20-slim AS build
WORKDIR /usr/src/app
RUN npm install -g @angular/cli
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY --from=build /usr/src/app/release /usr/share/nginx/html
