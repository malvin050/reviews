FROM node:lts

WORKDIR /app
COPY package*.json /app/

RUN npm ci

COPY ./ /app/

RUN npm run build

ENV PORT 8080
EXPOSE 8080
ENTRYPOINT ["npm", "run", "serve"]