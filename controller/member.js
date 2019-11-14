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


module.exports = {

    async addMember (ctx) {
        let result = {
            code: 20008,
            success: false,
            msg: '新增失败'
        };
        const { 
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
            title
        } = ctx.request.body;

            const newMember = new Member({
                uid: uuidv1(),
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
                title
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
        const {  } = ctx.request.query;
        let obj = {}
        //检查数据库中是否存在该用户名
        await Member.find(obj, (err, member) => {
            if (err) {
                throw err;
            }
            if (!member.length) {
                ctx.body = {...result,data:member};
            } else {
                const listData = member && member.length ? member : []
                console.log(listData)
                const resData = getTreeList(listData, '0')
                ctx.body = {code: 10001, success: true, msg: '数据非空',data:resData}
            }
        })
    },
}