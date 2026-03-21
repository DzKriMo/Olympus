FROM node:24-bookworm

WORKDIR /srv

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
