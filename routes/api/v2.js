const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const url = require('url');

const { verifyToken, apiLimiter } = require('../middlewares');
const { Domain, User, Post, Hashtag } = require('../../models');

const router = express.Router();

// router.use(cors());
/*
 * Response Header
 * Access-Control-Allow-Origin: *
 */

router.use( async (req, res, next) => {
    console.log('CLIENT: ', req.get('origin'));                 // http://localhost:9003   
    console.log('CLIENT: ', url.parse(req.get('origin')).host); // localhost:9003

    const domain = await Domain.findOne({
        where: { host: url.parse(req.get('origin')).host }
    });
    if (domain) {
        cors( { origin: req.get('origin')} )(req, res, next);
        /*
        * Response Header
        * Access-Control-Allow-Origin: http://localhost:9003 
        */
    } else {
        next();
    }
});

router.post('/token', apiLimiter, async (req, res) => {

    const { clientSecret } = req.body;

    try {
        const domain = await Domain.findOne({
            where: { clientSecret: clientSecret },
            include: {
                model: User,
                attribute: ['nickname', 'id']
            }
        });

        if(!domain) {
            return res.status(401).json({
                code: 401,
                message: 'Not registered domain.'
            });
        }

        const token = jwt.sign({
            id: domain.user.id,
            nickname: domain.user.nickname
        }, process.env.JWT_SECRET, {
            expiresIn: '30m',    // 30 minutes
            issuer: 'YOLO corp.'
        });

        return res.json({
            code: 200,
            message: 'Token has been successfully issued.',
            token: token
        });

    } catch(err) {
        console.error(err);
        return res.status(500).json({
            code: 500,
            message: 'Server Error.'
        });
    }
});

router.get('/test', verifyToken, apiLimiter, (req, res) => {
    res.json(req.decoded);
});

router.get('/posts/my', apiLimiter, verifyToken, async (req, res) => {
    Post.findAll( { where: { userId: req.decoded.id } } )
    .then((posts) => {
        res.json({
            code: 200,
            payload: posts
        });
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({
            code: 500,
            message: 'Server Error.'
        });
    });
});

router.get('/posts/hashtag/:title', verifyToken, apiLimiter, async (req, res) => {
    try {
        const hashtag = await Hashtag.findOne({ where: {title: req.params.title} });
        if (!hashtag) {
            return res.status(404).json({
                code: 404,
                message: 'No search result.'
            });
        }

        const posts = await hashtag.getPosts();
        return res.json({
            code: 200,
            payload: posts
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            code: 500,
            message: 'Server Error'
        });
    }
});


module.exports = router;