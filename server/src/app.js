import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import postRoutes from './routes/postcard.routes.js';

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

app.use('/api/postcards', postRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// when routes dont match they falls through to here
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found`})
})

// Global error handler
app.use((err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // invalid ObjectId format 
    if (err.name === 'CastError') {
        statusCode = 400;
        message: `Invalid ${err.path}: ${err.value}`;
    }

    // when unique contraint is violated (duplicates)
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`
    }

    // schema validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((e) => e.message)
            .join(', ')
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack}),
    });
});

export default app;