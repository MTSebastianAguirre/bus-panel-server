const { request, response } = require('express');
const User = require('../models/User');
const Bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const LogIn = async(req = request, res = response) => {
    const { email, password } = req.body;
    //console.log(email, password);
    try {
        const UserFound = await User.findOne({
            attributes: ['id', 'nameUser', 'email', 'password', 'role', 'travelModule'],
            where: { email }
        });
        //console.log(Bcrypt.compareSync(password, UserFound.password));
        if(UserFound) {
            if(Bcrypt.compareSync(password, UserFound.password)) {
                UserFound.password = '*******************';
                const Token = JWT.sign({ UserFound }, process.env.SECRETKEY, { expiresIn: 28800});
                res.status(200).json({
                    ok: true,
                    user: UserFound,
                    token: Token,
                    id: UserFound.id
                });
            }else {
                return res.status(400).json({
                    ok: false, 
                    msg: 'INCORRECT_PASSWORD'
                })
            }
        }else {
            return res.status(400).json({
                ok: false,
                msg: 'INCORRECT_CREDENTIALS'
            });
        }
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        });
    }
}

module.exports = { LogIn };

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyRm91bmQiOnsiaWQiOjMsIm5hbWVVc2VyIjoiUHJ1ZWJhIiwiZW1haWwiOiJwcnVlYmFAbWFpbC5jb20iLCJwYXNzd29yZCI6IioqKioqKioqKioqKioqKioqKioiLCJyb2xlIjoiVVNFUl9ST0xFIiwidHJhdmVsTW9kdWxlIjpmYWxzZX0sImlhdCI6MTY1NDEwMTkxNywiZXhwIjoxNjU0MTMwNzE3fQ.-s5PJLZB1hx7w8Q091ttyMoMlmT-_zp-IWG6apd6Z7s