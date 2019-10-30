const mongoose = require('mongoose')
const User = require('./../models/user');

module.exports = {

    async getUserList (ctx) {

        let result = {
            code: 10002,
            success: false,
            msg: '数据为空'
        };
        //从请求体中获得参数
        const { username } = ctx.request.body;
        let obj = {}
        if (username) {
            obj = { username: new RegExp(username,'i') }
        }
        //检查数据库中是否存在该用户名
        await User.find(obj, (err, user) => {
            if (err) {
                throw err;
            }
            if (!user.length) {
                ctx.body = {...result,data:user};
            } else {
                ctx.body = {code: 10001, success: true, msg: '数据非空',data:user}
            }
        })
    },

    async userDel (ctx) {
        let result = {
            code: 10002,
            success: false,
            msg: '删除失败'
        };
        //从请求体中获得参数
        const { id } = ctx.request.query
        await User.deleteOne({"_id":mongoose.Types.ObjectId(id)}, (err, user) => {
            if (err) {
                throw err;
            }
            if (user.deletedCount) {
                ctx.body = {code: 10000, success: true, msg: '删除成功'}
            } else {
                ctx.body = result;
            }
        })
    },

    async userUpdate (ctx) {
        let result = {
            code: 20008,
            success: false,
            msg: '修改失败'
        };
        const { username, password, identity, parents } = ctx.request.body;
    
        await User.update({username: username},{$set:{
            username: username,
            password: password,
            identity: identity,
            parents: parents
        }},(err,res) => {
            if (!err) {
                ctx.body = {code: 10000,success: true, msg: '修改成功'}
            } else {
                ctx.body = result;
            }
        });
    }
}