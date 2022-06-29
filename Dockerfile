FROM ubuntu:latest

USER root

RUN apt update
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt -y install nodejs
RUN apt -y install npm
RUN apt -y install ffmpeg

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
RUN npm i --production

COPY . .

ENV NODE_ENV production
ENV PORT 8080
ENV HOST 0.0.0.0

CMD ["node", "index.js"]