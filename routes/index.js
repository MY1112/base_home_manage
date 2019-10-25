const router = require('koa-router')();

const login = require('./login');
const user = require('./user')

router.use('/login', login.routes(), login.allowedMethods());
router.use('/user', user.routes(), user.allowedMethods());

module.exports = router;