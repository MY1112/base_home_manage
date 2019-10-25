const router = require('koa-router')();
const userController = require('../controller/user');

const routers = router
    .post('/userList', userController.getUserList)
    .get('/userDel', userController.userDel)
    .post('/userUpdate', userController.userUpdate)

module.exports = routers;