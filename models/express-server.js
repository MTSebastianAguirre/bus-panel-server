const ExpressJS = require('express');
const Cors = require('cors');
const Routes = require('../routes/index');
const Database = require('../database/config');
require('./User');

class Express {
    constructor() {
        this.app = ExpressJS();
        this.port = process.env.PORT ?? 10400;
        this.connectDB();
        this.middlewares();
        this.routes();
    }

    async connectDB() {
        try {
            await Database.sync();
            console.log('Database connection has been established \x1b[32m%s\x1b[0m', 'successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    middlewares() {
        this.app.use(ExpressJS.json());
        this.app.use(ExpressJS.urlencoded({ extended: true }))
        this.app.use(Cors({
            origin: '*',
            allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
            methods: 'GET, POST, PUT, DELETE, PATCH, OPTION, HEAD'
        }));
    }

    routes() {
        this.app.use('/', Routes());
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor \x1b[32m%s\x1b[0m', 'listo', this.port);
        });
    }
}

module.exports = Express;