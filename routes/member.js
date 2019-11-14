const router = require('koa-router')();
const memberController = require('../controller/member');

const routers = router
    .post('/addMember', memberController.addMember)
    .get('/memberTreeList', memberController.memberTreeList)

module.exports = routers;