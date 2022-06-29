FROM node:18-alpine3.15

USER root

RUN apk add -u ffmpeg

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

COPY . .

ENV NODE_ENV production
ENV PORT 8080
ENV HOST 0.0.0.0

CMD ["node", "index.js"]