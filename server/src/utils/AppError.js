// extends built in error and adds status code to it
// gloabl error handler picks it up
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode
        // 4xx errors
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;