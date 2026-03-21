FROM node:24-bookworm

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json ./
RUN npm install

COPY . .

RUN mkdir -p /app/data /app/uploads

EXPOSE 3000

CMD ["npm", "start"]
