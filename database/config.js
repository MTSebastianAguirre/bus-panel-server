const Sequelize = require('sequelize');

const Database = new Sequelize('jwccavqv', 'jwccavqv', 'W3OXsOqVCB-nGCjgv6-gKJTf9wL16iTU', {
    host: 'motty.db.elephantsql.com',
    dialect: 'postgres',
    logging: false,//(...msg) => console.log(msg),
    define: {
        timestamps: false
    },
});

module.exports = Database;