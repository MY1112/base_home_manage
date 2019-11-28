const mongoose = require('mongoose')
const Schema = mongoose.Schema
const MemberSchema = new Schema({
    userId: {
        type: String, // 用户id
        require: true
    },
    address: {
        type: String // 现居地
    },
    birthplace: {
        type: [String] // 籍贯value
    },
    birthplaceText: {
        type: String // 籍贯文本
    },
    dateBirth: {
        type: String // 出生日期
    },
    dateDeath: {
        type: String // 死亡日期
    },
    deeds: {
        type: String // 生平经历
    },
    genderFlag: {
        type: Number, // 性别 男-1 女-2
        require: true
    },
    livingFlag: {
        type: Boolean, // 是否在世
        require: true
    },
    marryFlag: {
        type: Boolean // 是否已婚
    },
    pTitle: {
        type: String
    },
    pid: {
        type: String, // 上一级id
        require: true
    },
    pids: {
        type: [String], // 所有直系上级id
        require: true
    },
    remark: {
        type: String // 备注
    },
    spouseName: {
        type: String // 配偶姓名
    },
    title: {
        type: String, // 姓名
        require: true
    },
    uid: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('Member', MemberSchema);