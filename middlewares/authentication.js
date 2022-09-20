const JWT = require('jsonwebtoken');
const { response, request } = require('express');

const verifyToken = (req = request, res = response, next) => {
    const Token = req.query.token;
    if(Token) {
        JWT.verify(Token, process.env.SECRETKEY, (error, { UserFound }) => {
            if(!error) {
                req.UserFound = UserFound;
                next();
            }else {
                return res.status(401).json({
                    ok: false,
                    msg: 'TOKEN_INCORRECT',
                    error
                })
            }
        })
    }else {
        return res.status(401).json({
            ok: false,
            msg: 'NO_TOKEN'
        });
    }
}

const verifySameUser = (req = request, res = response, next) => {
    const { UserFound } = req;
    const { id } = req.params;
    if(UserFound.role === 'SUPER_USER' || UserFound.id === Number(id)) {
        return next();
    }else {
        return res.status(401).json({
            ok: false,
            msg: 'NOT_PERMISSIONS',
            errors: {
                msg: 'NOT_PERMISSIONS'
            }
        });
    }
}

const verifyAdminRole = (req = request, res = response, next) => {
    const { UserFound } = req;
    if(UserFound.role === 'SUPER_USER') {
        return next();
    }else {
        return res.status(401).json({
            ok: false,
            msg: 'NOT_PERMISSIONS',
            errors: {
                msg: 'NOT_PERMISSIONS'
            }
        });
    }
}

module.exports = { verifyToken, verifyAdminRole, verifySameUser }