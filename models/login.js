const mongoose = require('mongoose')
const Schema = mongoose.Schema
const LoginSchema = new Schema({
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
    }
});

module.exports = mongoose.model('User', LoginSchema);