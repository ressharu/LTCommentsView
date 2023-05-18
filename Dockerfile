FROM node:20

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY ./dist ./

#CMD [ "node", "index.js" ]
CMD [ "node", "index.js" ]