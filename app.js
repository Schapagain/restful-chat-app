const express = require('express');
const app = express();

const userRoutes = require('./api/routes/users');
const chatRoutes = require('./api/routes/chats');

app.use('/users', userRoutes);
app.use('/chats',chatRoutes);

module.exports = app;