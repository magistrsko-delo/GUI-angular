### STAGE 2: Run ###
FROM nginx:1.17.1-alpine

EXPOSE 80
COPY release /usr/share/nginx/html
