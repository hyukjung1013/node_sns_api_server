const express = require('express');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middlewares');
const { Domain, User } = require('../../models');

const router = express.Router();

router.post('/token', async (req, res) => {

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
            expiresIn: '1m',    // 1minute
            issuer: 'yologrammer'
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

router.get('/test', verifyToken, (req, res) => {
    res.json(req.decoded);
});

module.exports = router;