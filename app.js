//jshint esversion:9
// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require('./config')(app);

const socketIo = require('socket.io');

let io = socketIo();
app.io = io;

app.set('trust proxy', 1);

const cors = require('cors');

// controls a very specific header to pass headers from the frontend
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN || 'http://localhost:3000' || 'https://ironconnections.netlify.app',
  })
);

// 👇 Start handling routes here
// Contrary to the views version, all routes are controlled from the routes/index.js
const allRoutes = require('./routes/index.routes');
app.use('/api', allRoutes);

const postRoutes = require('./routes/post.routes');
app.use('/api', postRoutes);

const userRoutes = require('./routes/user.routes');
app.use('/api', userRoutes);

const commentRoutes = require('./routes/comment.routes');
app.use('/api', commentRoutes);

const notificationRoutes = require('./routes/notification.routes')(io);
app.use('/api', notificationRoutes);

const messageRoutes = require('./routes/message.routes');
app.use('/api', messageRoutes);

const authRouter = require('./routes/auth.routes');
app.use('/api', authRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;
