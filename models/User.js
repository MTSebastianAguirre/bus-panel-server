const { DataTypes } = require('sequelize');
const Database = require('../database/config');
const Bcrypt = require('bcrypt')

const User = Database.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nameUser: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: {
                msg: 'NAME_VALIDATE_DB'
            }
        }
    },
    email: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'ADD_EMAIL_VALID'
            },
            notEmpty: {
                msg: 'EMAIL_ERROR'
            }
        },
        unique: {
            args: true, 
            msg: 'USER_REGISTER'
        }
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: 'PASSWORD_ERRor'
        }
    },
    role: {
        type: DataTypes.STRING(60),
        defaultValue: 'USER_ROLE'
    },
    travelModule: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    hooks: {
        beforeCreate: (user) => user.password = Bcrypt.hashSync(user.password, Bcrypt.genSaltSync(10))
    }
});


module.exports = User;