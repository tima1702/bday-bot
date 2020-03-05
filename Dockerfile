FROM node:12-slim

COPY . /app

WORKDIR /app

RUN npm i

CMD npm start