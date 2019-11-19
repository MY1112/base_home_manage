const mongoose = require('mongoose')
const Member = require('./../models/member');
const uuidv1 = require('uuid/v1');


getTreeList = (data, pid) => {
    const result = []
    let temp = []
    for (let i = 0; i < data.length; i++) {
      if (data[i].pid === pid) {
        const obj = {
            key: data[i].uid,
            pid: data[i].pid,
            pids: data[i].pids,
            title: data[i].title,
            value: data[i].uid
        }
        temp = getTreeList(data, data[i].uid)
        if (temp.length > 0) {
            obj.children = temp
        } else {
            obj.children = []
        }
        result.push(obj)
      }
    }
    return result
}

getTree = (data, pid) => {
    const result = []
    let temp = []
    for (let i = 0; i < data.length; i++) {
      if (data[i].pid === pid) {
        const obj = {
            "id": data[i].title
        }
        temp = getTree(data, data[i].uid)
        if (temp.length > 0) {
            obj["children"] = temp
        }
        result.push(obj)
      }
    }
    return result
}


module.exports = {

    async addMember (ctx) {
        let result = {
            code: 20008,
            success: false,
            msg: '新增失败'
        };
        const {
            userId,
            address,
            birthplace,
            dateBirth,
            dateDeath,
            deeds,
            genderFlag,
            livingFlag,
            marryFlag,
            pid,
            pids,
            remark,
            spouseName,
            title,
            birthplaceText
        } = ctx.request.body;

            const newMember = new Member({
                uid: uuidv1().replace(/[-]/g, ''),
                address,
                birthplace,
                dateBirth,
                dateDeath,
                deeds,
                genderFlag,
                livingFlag,
                marryFlag,
                pid,
                pids,
                remark,
                spouseName,
                title,
                birthplaceText,
                userId
            });

            const doc = await newMember.save();
            if (!doc.errors) {
                ctx.body = {code: 10000,success: true, msg: '新增成功'}
            } else {
                ctx.body = result;
            }
    },

    async memberTreeList (ctx) {

        let result = {
            code: 10002,
            success: false,
            msg: '数据为空'
        };
        //从请求体中获得参数
        const { userId } = ctx.request.query;
        let obj = { userId }
        //检查数据库中是否存在该用户名
        await Member.find(obj, (err, member) => {
            if (err) {
                ctx.body = {code: 20002, success: false, msg: '异常报错'}
                throw err;
            }
            if (!member.length) {
                ctx.body = {...result,data:member};
            } else {
                const listData = member && member.length ? member : []
                const resData = getTreeList(listData, '0')
                ctx.body = {code: 10001, success: true, msg: '数据非空',data:resData}
            }
        })
    },

    async memberDetail (ctx) {

        let result = {
            code: 10002,
            success: false,
            msg: '数据为空'
        };
        //从请求体中获得参数
        const { id } = ctx.request.query
        const memberCount = new Promise((resolve, reject) => {
            Member.count({'pids': id},(err, count) => {
                if(err) {
                    reject()
                }
                resolve(count)
            })
        })
        const memberDetail = new Promise((resolve, reject) => {
            Member.findOne({
                uid: id
            }, (err, member) => {
                if (err) {
                    reject()
                }
                resolve(member)
            })
        })

        await Promise.all([memberCount, memberDetail]).then((res) => {
            ctx.body = {
                code: 10001,
                success:true,
                msg: '操作成功，数据非空',
                data:{...res[1]._doc,memberNum: res[0]}
            }
        }).catch((err) => {
            ctx.body = {code: 20002, success: false, msg: '异常报错'}
            throw(err)
        })
    },

    async memberUpdate (ctx) {
        let result = {
            code: 20000,
            success: false,
            msg: '修改失败'
        };
        const { 
            id,
            address,
            birthplace,
            birthplaceText,
            dateBirth,
            dateDeath,
            deeds,
            genderFlag,
            livingFlag,
            marryFlag,
            remark,
            spouseName,
            title
        } = ctx.request.body;
    
        await Member.update({uid: id},{$set:{
            address,
            birthplace,
            birthplaceText,
            dateBirth,
            dateDeath,
            deeds,
            genderFlag,
            livingFlag,
            marryFlag,
            remark,
            spouseName,
            title
        }},(err,res) => {
            if (!err) {
                ctx.body = {code: 10000,success: true, msg: '修改成功'}
            } else {
                ctx.body = result;
            }
        });
    },

    async memberDel (ctx) {
        let result = {
            code: 20000,
            success: false,
            msg: '删除失败'
        };
        //从请求体中获得参数
        const { id } = ctx.request.query
        await Member.deleteOne({uid: id}, (err, member) => {
            if (err) {
                ctx.body = {code: 20002, success: false, msg: '异常报错'}
                throw err;
            }
            console.log(member)
            if (member) {
                ctx.body = {code: 10000, success: true, msg: '删除成功'}
            } else {
                ctx.body = result;
            }
        })
    },

    async memberTree (ctx) {

        let result = {
            code: 10002,
            success: false,
            msg: '数据为空'
        };
        //从请求体中获得参数
        const { userId } = ctx.request.query;
        let obj = { userId }
        //检查数据库中是否存在该用户名
        await Member.find(obj, (err, member) => {
            if (err) {
                ctx.body = {code: 20002, success: false, msg: '异常报错'}
                throw err;
            }
            if (!member.length) {
                ctx.body = {...result,data:member};
            } else {
                const listData = member && member.length ? member : []
                const resData = getTree(listData, '0')
                ctx.body = {code: 10000, success: true, msg: '数据非空',data:resData}
            }
        })
    },
}