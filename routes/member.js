const router = require('koa-router')();
const memberController = require('../controller/member');

const routers = router
    .post('/addMember', memberController.addMember)
    .get('/memberTreeList', memberController.memberTreeList)
    .get('/memberDetail', memberController.memberDetail)
    .post('/memberUpdate', memberController.memberUpdate)
    .get('/memberDel', memberController.memberDel)
    .get('/memberTree', memberController.memberTree)

module.exports = routers;