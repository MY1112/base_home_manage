const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config')

module.exports = {
    async signUp (ctx) {

        let result = {
            code: 20008,
            success: false,
            msg: '注册失败'
        };
        const { username, password, identity, parents, pid } = ctx.request.body;

        let user = await User.findOne({username});
        //检查用户名是否已存在
        if(!user) {
            const newUser = new User({
                username: username,
                password: password,
                identity: identity,
                parents: parents,
                pid: pid
            });

            const doc = await newUser.save();
            if (!doc.errors) {
                ctx.body = {code: 10000,success: true, msg: '注册成功'}
            } else {
                ctx.body = result;
            }
        } else {
            ctx.body = { code: 20008, success: false, msg: '用户名已存在'};
        }
    },

    async signIn (ctx) {

        let result = {
            code: 20008,
            success: false,
            msg: '用户不存在'
        };
        //从请求体中获得参数
        const { username,  password } = ctx.request.body;
        //检查数据库中是否存在该用户名
        const user = await User.findOne({
            username
        }, (err) => {
            if (err) {
                ctx.body = {code: 20002, success: false, msg: '异常报错'}
                throw err;
            }
        })
        if (!user) {
            ctx.body = result;
        } else {
            //判断密码是否正确
            if (password === user.password) {
                const token = jwt.sign({
                    username: user.username,
                    identity: user.identity
                }, config.secret, { expiresIn: 3600 * 24 * 2 });
                ctx.body = {code: 10000, success: true, msg: '登入成功',data:{
                    token,
                    _id: user._id,
                    username: user.username,
                    identity: user.identity,
                    parents: user.parents,
                    pid: user.pid || ''
                }}
            } else {
                ctx.body = {code: 20008, success: false, msg: '密码错误'}
            }
        }
    }
}