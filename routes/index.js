const router = require('koa-router')();

const login = require('./login');

router.use('/login', login.routes(), login.allowedMethods());

module.exports = router;