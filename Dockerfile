FROM node:20-slim

WORKDIR /app

COPY ./src ./src

COPY ./package*.json ./

RUN npm install

RUN npm install pm2 -g

EXPOSE 3000

CMD ["pm2-runtime", "start", "npm", "--", "start"]
