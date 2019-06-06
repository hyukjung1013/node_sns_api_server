const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('login');
});

router.post('/login_process', 
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login'
    })
);

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.save(function() {
        res.redirect('/');
    });
});

router.get('/signup', isNotLoggedIn, (req, res) => {
    var msg = req.flash('join_error_msg');
    if(msg) {
        res.render('signup', { msg: msg });
    } else {
        res.render('signup', { msg: '' });
    }
});

router.post('/signup_process', async (req, res) => {
    var email = req.body.email;
    var name = req.body.name;
    var password = req.body.password;
    var nickname = req.body.nickname;

    try {
        var exUser = await User.findOne({ where : {email: email, provider: 'local'} });
        if (exUser) {
            req.flash('join_error_msg', 'Email already exists.');
            return res.redirect('/auth/join');
        } else {
            var hash = await bcrypt.hash(password, 12);

            await User.create({
                email: email,
                nickname: nickname,
                name: name,
                password: hash,
                provider: 'local'
            });

            var user = await User.findOne({ where: {
                email: email, 
                provider: 'local'
            } });

            req.login(user, function(err) {
                return res.redirect('/');
            });
        }
    } catch(err) {
        console.error(err);
        next(err);
    }
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    successRedirect: '/',
    failureRedirect: '/'
}));

router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
}));

module.exports = router;