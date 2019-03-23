FROM nginx:mainline-alpine

COPY default.conf /etc/nginx/conf.d/

COPY /build /var/www/html

EXPOSE 80
