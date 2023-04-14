FROM node:16-alpine as build

WORKDIR /var/www/html
COPY . /var/www/html

RUN npm install
RUN npm i rimraf

CMD ["npm", "start"]
EXPOSE 3003
