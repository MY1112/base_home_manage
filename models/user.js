const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    identity: {
        type: String
    },
    parents: {
        type: String
    },
    pid: {
        type: String
    }
});

module.exports = mongoose.model('User', UserSchema);