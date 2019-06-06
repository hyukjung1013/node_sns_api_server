const FacebookStrategy = require('passport-facebook').Strategy;
const { User } = require('../models');

var facebookConfig = require('./config/facebook.json');
module.exports = (passport) => {
    passport.use(new FacebookStrategy(facebookConfig, 
        async (accessToken, refreshToken, profile, done) => {
            try {
                var exUser = await User.findOne({ where : {
                    snsId: profile.id, 
                    provider: 'facebook'
                }});

                if (exUser) {
                    done(null, exUser);
                } else {
                    await User.create({
                        snsId: profile.id,
                        provider: 'facebook',
                        nickname: profile.displayName,
                    });
                    const newUser = await User.findOne({ where: {
                        snsId: profile.id, 
                        provider: 'facebook'}
                    });
                    done(null, newUser);
                }
            } catch (err) {
                console.error(err);
                done(err);
            }
        }));
};