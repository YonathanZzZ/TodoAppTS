FROM node:20-alpine
WORKDIR /app
COPY package*.json ./

ENV DB_HOST=localhost
ENV DB_DATABASE=todo_app
ENV DB_TEST_DATABASE=todo_app_test
ENV DB_USERNAME=todo_app
ENV DB_PASSWORD=todo_app
ENV DB_PORT=3306
ENV JWT_SECRET_KEY=3HdFRFcwcBfhcXboq85pBM5xQsbdwNJM
ENV PORT=8080
ENV CLIENT_URL=http://localhost:5173

RUN npm install
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]