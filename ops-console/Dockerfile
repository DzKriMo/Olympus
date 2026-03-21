FROM node:24-bookworm

WORKDIR /srv

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 7000

CMD ["npm", "start"]
