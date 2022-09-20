const { Init, getAllUsers, getUsersRole, searchUser, createUserDB, updateUser, changeStatusTravelModule, deleteUser } = require('../controllers/usersController');
const { verifyToken, verifyAdminRole, verifySameUser } = require('../middlewares/authentication');
const { LogIn } = require('../controllers/authController');
const { Router } = require('express');
const Routes = Router();

module.exports = () => {
    Routes.get('/', Init);
    Routes.post('/create-user', createUserDB);
    Routes.post('/login', LogIn);
    Routes.put('/user/:id', [verifyToken, verifySameUser], updateUser);
    Routes.get('/get-user/all', getAllUsers);
    Routes.get('/user/user-role', getUsersRole);
    Routes.get('/search/collection/user/:value', searchUser);
    Routes.get('/user/travelmodule/:id', [verifyToken, verifyAdminRole], changeStatusTravelModule);
    Routes.delete('/user/:id', [verifyToken, verifyAdminRole], deleteUser);
    return Routes;
};