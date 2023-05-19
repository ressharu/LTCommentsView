FROM node

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY ./dist .

CMD [ "node", "index.js" ]