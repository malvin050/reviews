FROM node:lts AS builder

WORKDIR /app
COPY package*.json /app/

RUN npm ci

COPY ./ /app/

RUN npm run build


FROM nginxinc/nginx-unprivileged:stable
COPY --from=builder /app/build/ /usr/share/nginx/html
COPY default.conf.template /etc/nginx/templates/default.conf.template
CMD ["nginx", "-g", "daemon off;"]