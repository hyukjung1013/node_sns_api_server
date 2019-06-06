const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); 
const { Post, User } = require('../models');

router.get('/', isLoggedIn, (req, res) => {
    Post.findAll({
        include: {
            model: User,
            attribute: ['id', 'nickname']
        },
        order: [['createdAt', 'DESC']]
    }).then((posts) => {
        res.render('main', {
            user: req.user,
            posts: posts
        });
    }).catch((error) => {
        console.error(error);
        next(error);
    });
});

module.exports = router;