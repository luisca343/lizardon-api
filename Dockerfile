FROM node:16.15.0-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 34301

CMD ["npm", "run", "start"]