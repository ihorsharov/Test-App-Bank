FROM node:18-alpine

RUN apk update && apk add --no-cache openssl

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production && npm install -g prisma

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
