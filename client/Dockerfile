FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ENV VITE_SERVER_URL=http://localhost:8080

RUN npm run build
EXPOSE 5173

CMD ["npm", "start"]
