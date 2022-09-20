const { request, response } = require('express');
const User = require('../models/User');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Bcrypt = require('bcrypt');

const Init = (req = request, res = response) => {
    res.status(200).json({
        ok: true,
        petition: 'Correct.'
    });
}

const createUserDB = async (req = request, res = response) => {
    try {
        //const email = 'prueba7@mail.com';
        //const password = 'prueba2022';
        //const nameUser = 'Prueba7';
        //const role = 'SUPER_USER';
        const { email, password, nameUser, role } = req.body;
        const UserCreated = await User.create({nameUser, email, password, role});
        //?console.log(UserCreated);
        if(UserCreated) {
            UserCreated.password = '******';
            res.status(200).json({
                ok: true,
                userObj: { email, nameUser, role },
                UserCreated
            });
        }else {
            res.status(400).json({
                ok: false,
                msg: 'ERROR_SAVE_USER_DB'
            });
        }
    } catch (error) {
        //?console.error(error);
        res.status(400).json({
            ok: false,
            error,
            msg: error.errors[0].message
        });
    }
} 

const getAllUsers = async (req = request, res = response) => {
    try {
        const Users = await User.findAll();
        if(Users) {
            res.status(200).json({
                ok: true,
                Users
            });
        }else {
            res.status(204).json({
                ok: true,
                msg: 'No Users'
            });
        }
    } catch (error) {
        res.status(500).json({
            ok: false, 
            error
        });
    }
}

const getUsersRole = async(req = request, res = response) => {
    try {
        const From = Number(req.query.from ?? 0);
        //console.log(From);
        const Users = await User.findAndCountAll({
            attributes: ['id', 'nameUser', 'email', 'role', 'travelModule'],
            where: { role: 'USER_ROLE' },
            limit: 5,
            offset: From
        });
        res.status(200).json({
            ok: true, 
            users: Users.rows,
            count: Users.count
        }) ;
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: '',
            error
        })
    }
}

const searchUser = async (req = request, res = response) => {
    try {
        const { value } = req.params;
        const From = Number(req.query.from ?? 0);
        const Users = await User.findAndCountAll({
            attributes: ['id', 'nameUser', 'email', 'role'],
            where: {
                [Op.or]: [
                    {nameUser: {[Op.like]: '%' + value + '%'}},
                    {email: {[Op.like]: '%' + value + '%'}}  
                ],
                role: 'USER_ROLE'
            },
            limit: 5,
            offset: From
        });
        res.status(200).json({
            msg: 'SUCCESS_REST_SEARCH_USER',
            users: Users.rows,
            count: Users.count
        });
    } catch (error) {
        res.status(500).json({
            msg: 'ERROR_SEARCH_USER',
            error: error
        });
    }
}

const updateUser = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const Body = req.body;
        const UserFound = await User.findOne({
            where: { id }
        });
        if(UserFound) {
            UserFound.nameUser = Body.nameUser;
            UserFound.email = Body.email;
            UserFound.password = Bcrypt.hashSync(Body.password, Bcrypt.genSaltSync(10));
            UserFound.save().then(userUpdate => {
                userUpdate.password = '************';
                res.status(200).json({
                    ok: true,
                    user: userUpdate
                });
            }).catch(err => {
                return res.status(500).json({
                    ok: false,
                    msg: 'Cannot Update',
                    errors: err
                });
            })
        }else {
            return res.status(400).json({
                ok: false,
                msg: 'User No Found',
                errors: {msg: ''}
            });
        }
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error while Searching',
            errors: error
        });
    }
} 

const changeStatusTravelModule = (req = request, res = response) => {
    const { id: ID } = req.params;
    const { checked } = req.query;
    try {
        const id = Number(ID);
        User.update(
            { travelModule: checked }, 
            { where: { id } }
        ).then(userUpdate => {
            res.status(201).json({
                ok: true,
                user: userUpdate
            });
        }).catch(err => {
            res.status(500).json({
                ok: false,
                error: err
            });
        });
    } catch (error) {
        console.error(error);
    }
}

const deleteUser = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const UserDeleted = await User.destroy({
            where: { id }
        });
        if(UserDeleted) {
            UserDeleted.password = '****';
            res.status(201).json({
                ok: true,
                UserDeleted
            });
        }else {
            return res.status(400).json({
                ok: false,
                msg: 'USER_DOES_NOT_EXIST',
                errors: {
                    msg: 'USER_DOES_NOT_EXIST'
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'ERROR_DELETE_USER',
            errors: err 
        });
    }
}

module.exports = { 
    Init, 
    getAllUsers, 
    getUsersRole, 
    searchUser, 
    createUserDB, 
    updateUser,
    changeStatusTravelModule,
    deleteUser
};