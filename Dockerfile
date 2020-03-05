FROM node:12.16.1

COPY . /app

WORKDIR /app

RUN npm i

CMD npm start