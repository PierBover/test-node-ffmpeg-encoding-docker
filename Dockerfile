FROM ubuntu:latest

USER root

RUN apt update
RUN apt -y install --no-install-recommends curl
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt -y install --no-install-recommends nodejs
RUN apt -y install --no-install-recommends ffmpeg

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

COPY . .

ENV NODE_ENV production
ENV PORT 8080
ENV HOST 0.0.0.0

CMD node index.js
