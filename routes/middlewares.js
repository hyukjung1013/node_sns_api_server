const jwt = require('jsonwebtoken');

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