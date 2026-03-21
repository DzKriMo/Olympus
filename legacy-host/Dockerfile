FROM node:24-bookworm

WORKDIR /srv

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 2121 2222 8081

CMD ["npm", "start"]
