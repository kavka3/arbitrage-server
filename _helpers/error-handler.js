module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        // custom application error
        console.log("errorHandler.string: ", err);
        return res.status(400).json({ message: err });
    }

    if (err.name === 'ValidationError') {
        console.log("errorHandler.ValidationError: ", err);
        // mongoose validation error
        return res.status(400).json({ message: err.message });
    }

    if (err.name === 'UnauthorizedError') {
        console.log("errorHandler.UnauthorizedError: ", err);
        // jwt authentication error
        return res.status(401).json({ message: 'Invalid Token' });
    }

    // default to 500 server error
    return res.status(500).json({ message: err.message });
}