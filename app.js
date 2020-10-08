require('dotenv').config();

const path = require('path');
global.appRoot = path.resolve(__dirname);

const express = require('express');
const app = express();
const morgan = require('morgan');
const {verifyAuthToken_socket} = require('./utils/authorization');

// App routes
const userRoutes = require('./api/routes/users');
const chatRoutes = require('./api/routes/chats');
const registerRoutes = require('./api/routes/register');
const loginRoutes = require('./api/routes/login');

// Log all incoming requests before handling them
app.use(morgan('dev'));

// User express to parse urlencodings and json data
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Enable Cross Origin Sharing for everyone
app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','*');

    // Handle initial OPTIONS request
    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods','GET, POST, PATCH, PUT, DELETE');
        return res.status(200).json({});
    }
    next();
});

// Serve static files
app.use('/login',express.static('public/login'));
app.use('/:token',verifyAuthToken_socket,express.static('public/chat'));

// Use middleware to handle valid routes
app.use('/users', userRoutes);
app.use('/chats',chatRoutes);
app.use('/register',registerRoutes);
app.use('/login',loginRoutes);

// Forward invalid routes to the error handler below
app.use((req,res,next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

// Handle all errors throw
app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        }
    });
});

module.exports = app;