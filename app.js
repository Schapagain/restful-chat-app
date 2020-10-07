require('dotenv').config()

const path = require('path');
const express = require('express');
const app = express();
const morgan = require('morgan');
global.appRoot = path.resolve(__dirname);

// App routes
const userRoutes = require('./api/routes/users');
const chatRoutes = require('./api/routes/chats');
const registerRoutes = require('./api/routes/register');

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

// Use middleware to handle valid routes
app.use('/users', userRoutes);
app.use('/chats',chatRoutes);
app.use('/register',registerRoutes);

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
            message: error.stack,
        }
    });
});

module.exports = app;