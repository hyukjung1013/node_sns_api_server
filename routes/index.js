const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); 
const { Post, User, Domain } = require('../models');
const uuidv4 = require('uuid/v4');

router.get('/', isLoggedIn, (req, res) => {
    User.findOne({
        where: { id: req.user.id },
        include: { model: Domain }
    }).then((user) => {
        res.render('main', {
            user: user,
        });
    }).catch((error) => {
        console.error(error);
        next(error);
    });
});

router.post('/domain', (req, res, next) => {
    Domain.create({
        userId: req.user.id,
        host: req.body.host,
        type: req.body.type,
        clientSecret: uuidv4()
    })
    .then(() => {
        res.redirect('/');
    }).catch((error) => {
        next(error);
    });
});

module.exports = router;