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
        const { keywords, identity, pid } = ctx.request.body;
        let obj = {}
        if (keywords && identity === 'god') {
            obj = { username: new RegExp(keywords,'i') }
        }
        if (identity === 'admin') {
            if (keywords) {
                obj = {$and: [
                    {$or:[{_id:mongoose.Types.ObjectId(pid)},{pid:pid}]},
                    {$or:[{username: new RegExp(keywords,'i')}]}
                ]}
            } else {
                obj = {$or:[
                    {_id:mongoose.Types.ObjectId(pid)},
                    {pid:pid}
                ]}
            }
        }
        //检查数据库中是否存在该用户名
        const user = await User.find(obj, (err) => {
            if (err) {
                ctx.body = {code: 20002, success: false, msg: '异常报错'}
                throw err;
            }
        })
        if (!user.length) {
            ctx.body = {...result,data:user};
        } else {
            ctx.body = {code: 10001, success: true, msg: '数据非空',data:user}
        }
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
                ctx.body = {code: 20002, success: false, msg: '异常报错'}
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
        const { username, password, parents } = ctx.request.body;
    
        await User.update({username: username},{$set:{
            username: username,
            password: password,
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