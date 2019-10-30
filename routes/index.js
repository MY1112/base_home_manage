const router = require('koa-router')();

const login = require('./login');
const user = require('./user');
const member = require('./member');

router.use('/login', login.routes(), login.allowedMethods());
router.use('/user', user.routes(), user.allowedMethods());
router.use('/member', member.routes(), member.allowedMethods());

module.exports = router;