FROM node:14.17-alpine

WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .