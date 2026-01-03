FROM node:18

RUN npm install --global nodemon
RUN npm install -g ts-node

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["node", "app.js"]