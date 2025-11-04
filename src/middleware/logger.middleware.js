loggerMiddleware = (req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl} - ${new Date().toGMTString()}`);
    next();
};

module.exports = loggerMiddleware;