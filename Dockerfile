FROM node:lts-alpine

WORKDIR '/var/www/app'

COPY package*.json ./
COPY bin ./bin
COPY helpers ./helpers
COPY routes ./routes
COPY swagger.json .
COPY app.js .

RUN npm install
ENV PORT 3000

CMD ["npm", "start"]

EXPOSE 3000