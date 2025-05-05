FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install -g pnpm
RUN npm install -g ts-node
RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]