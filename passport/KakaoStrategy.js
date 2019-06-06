const KakaoStrategy = require('passport-kakao').Strategy;
const { User } = require('../models');

var kakaoConfig = require('./config/kakao.json');
module.exports = (passport) => {
    passport.use(new KakaoStrategy(kakaoConfig, 
        async (accessToken, refreshToken, profile, done) => {
            try {
                var exUser = await User.findOne({ where: {
                    snsId: profile.id, 
                    provider: 'kakao'}
                });

                if (exUser) {
                    done(null, exUser);
                } else {
                    await User.create({
                        snsId: profile.id,
                        provider: 'kakao',
                        nickname: profile.displayName,
                    });
                    const newUser = await User.findOne({ where: {
                        snsId: profile.id, 
                        provider: 'kakao'}
                    });
                    done(null, newUser);
                }
            } catch (err) {
                console.error(err);
                done(err);
            }

        }));
};