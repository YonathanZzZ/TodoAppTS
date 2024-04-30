# Todo App

A Todo webapp built with React for the client-side and Node.js for the server-side. It provides basic Todo functionalities such as adding, editing and removing tasks, and marking tasks as done. Additionally, users can register and login to access their personalized Todo lists, and their data is stored in an SQL database.

## Access the app
You can access the deployed Todo app [here](https://todo-yonathan-43eab9f75c75.herokuapp.com/)

## Features

* User Authentication: Users can register and login to access their Todo lists. User passwords are securely encrypted using bcrypt and stored in the database.

* JWT Token: JSON Web Tokens (JWT) are used for user login authentication. The token is securely stored as a cookie for subsequent requests.

* Real-time Updates: Utilizes socket.io to enable real-time updates for users. When a user adds a new task on one device, it automatically syncs and appears on other connected devices.

* Material UI Components: The React client utilizes various Material UI components to create a responsive user interface.

## Technologies Used

* React.js: frontend (using TypeScript)

* Node.js (with Express): backend (server, using TypeScript)

* Sequelize (SQL): storing user data including Todo lists and user credentials

* JWT: user authentication

* bcrypt: password encryption

* Socket.io: real - time updates for clients used by the same user


