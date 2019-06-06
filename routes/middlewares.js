const jwt = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');

exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/auth/login');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
}; 

exports.verifyToken = (req, res, next) => {
    try {
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        return next();
    } catch (err) {
        if ( err.name === 'TokenExpiredError' ) {
            return res.status(419).json({
                code: 419,
                message: 'Token has Expired.'
            });
        }
        return res.status(401).json({
            code: 401,
            message: 'Invalid Token'
        });
    }
}; 

exports.apiLimiter = new RateLimit({
    windowMs: 60 * 1000,    // 1minute
    max: 5,                 // 5 times a minute  
    delayMs: 0,
    handler(req, res) {
        res.status(this.statusCode).json({
            code: this.statusCode,
            message: 'You can request 5 times a minute.'
        });
    }
});

exports.deprecated = (req, res) => {
    res.status(410).json({
        code: 410,
        message: 'New version released. Use new version.'
    });
}