// wraps any async controller, removes the need for try/catch in a controller
// any thrown error or rejected promise is auto caught and passed to next(err)
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
}

export default asyncHandler;