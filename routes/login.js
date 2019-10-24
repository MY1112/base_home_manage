const router = require('koa-router')();
const loginController = require('../controller/login');

const routers = router
    .get('/test', async (ctx, next) => {
        const result = {
            code:10000,
            response: {message: 'success circlemeng'}
        }
        console.log(ctx.url)
        ctx.body = result;
    })
    .post('/signup', loginController.signUp)
    .post('/signin', loginController.signIn)

module.exports = routers;