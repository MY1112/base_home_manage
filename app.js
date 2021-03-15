/*
 * @Author: mengyuan
 * @Date: 2019-09-29 11:41:01
 * @Last Modified by: Circlemeng
 * @Last Modified time: 2020-12-30 17:47:44
 */
const koa = require('koa')
const bodyParser = require('koa-bodyparser')
const static = require('koa-static') //静态资源服务
const path = require('path')
const cors = require('koa2-cors')
const convert = require('koa-convert')
const jwt = require('koa-jwt') // jwt加解码中间件
const mongoose = require('mongoose')
const config = require('./config')
const routers = require('./routes/index')
const compress = require('koa-compress');
const app = new koa()

app.use(
  compress({
    threshold: 10240,
  })
)

app.use(bodyParser()) // 解析request的body

app.use(
  cors({
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
    maxAge: 100,
    credentials: true,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: [
      'Content-Encoding',
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Custom-Header',
      'anonymous',
    ],
  })
)

app.use(convert(static(path.join(__dirname, 'public'))))

app.use((ctx, next) => {
  // if (ctx.header && ctx.header.authorization) {
  //   const token = ctx.header.authorization
  //   console.log(ctx)
  //   try {
  //     //jwt.verify方法验证token是否有效
  //     jwt.verify(token, config.secret, {
  //       complete: true,
  //     })
  //   } catch (error) {
  //     //token过期 生成新的token
  //     const newToken = getToken(user)
  //     //将新token放入Authorization中返回给前端
  //     ctx.res.setHeader('Authorization', newToken)
  //   }
  // }
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401
      ctx.body = {
        code: 401,
        message: '认证失效，请重新登录',
      }
    } else {
      throw err
    }
  })
})

//添加jwt认证
app.use(
  jwt({ secret: config.secret }).unless({
    path: [/^\/login\/signin/],
  })
)

mongoose.Promise = global.Promise
mongoose.connect(config.database, { useNewUrlParser: true })

app.use(routers.routes()).use(routers.allowedMethods())

app.listen(9000)
console.log('app started at port 9000...')
