/*
 * @Author: mengyuan 
 * @Date: 2019-09-29 11:41:01 
 * @Last Modified by: mengyuan
 * @Last Modified time: 2019-10-25 17:54:20
 */
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');    //静态资源服务
const path = require('path')
const cors = require('koa2-cors')
const convert  = require('koa-convert')
const mongoose = require('mongoose')
const config = require('./config')
const routers = require('./routes/index')
const app = new koa();
app.use(bodyParser()); // 解析request的body

app.use(cors({
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
    maxAge: 100,
    credentials: true,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
}));

app.use(convert(static(
    path.join( __dirname, 'public')
)));

mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useNewUrlParser: true });

app.use(routers.routes()).use(routers.allowedMethods())

app.listen(9000);
console.log('app started at port 9000...')
