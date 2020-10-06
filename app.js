const express = require('express');
const app = express();
const morgan = require('morgan');

const userRoutes = require('./api/routes/users');
const chatRoutes = require('./api/routes/chats');

// Log all incoming requests before handling them
app.use(morgan('dev'));

app.use('/users', userRoutes);
app.use('/chats',chatRoutes);

module.exports = app;