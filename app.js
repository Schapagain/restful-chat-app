const express = require('express');
const app = express();
const morgan = require('morgan');

const userRoutes = require('./api/routes/users');
const chatRoutes = require('./api/routes/chats');

// Log all incoming requests before handling them
app.use(morgan('dev'));


// Use middleware to handle valid routes
app.use('/users', userRoutes);
app.use('/chats',chatRoutes);

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