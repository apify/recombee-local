FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY src/ ./src/

EXPOSE 9300

CMD ["node", "src/index.js", "--port", "9300", "--data", "/data/recombee"]
