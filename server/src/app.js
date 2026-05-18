const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express()

app.use(helmet())

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

// will add the rate limiter later

// convert req.body to json and limit payload size
app.use(express.json({ limit: '10kb' }));

// parse url encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// cookie parsing
app.use(cookieParser());

// logs in dev mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// when routes dont match they falls through to here
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found`})
})

// Global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        ...(proccess.env.NODE_ENV === 'development' && { stack: err.stack}),
    });
});

module.exports = app;
