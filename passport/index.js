const local = require('./LocalStrategy');
const kakao = require('./KakaoStrategy');
const facebook = require('./FacebookStrategy');
const { User } = require('../models');

module.exports = (passport) => {

    passport.serializeUser((user, done) => {
        done(null, user.dataValues.id);
    });

    passport.deserializeUser((id, done) => {
        User.findOne({
            where: { id },
            include: [{
                model: User,
                attribute: ['id', 'nick'],
                as: 'Followers'
            }, {
                model: User,
                attribute: ['id', 'nick'],
                as: 'Followings'
            }],
        })
        .then(user => {
            done(null, user)
        })
        .catch(err => done(err));
    });

    local(passport);
    kakao(passport);
    facebook(passport);
};