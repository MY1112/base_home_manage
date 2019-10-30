const mongoose = require('mongoose')
const Schema = mongoose.Schema
const MemberSchema = new Schema({
    
});

module.exports = mongoose.model('Member', MemberSchema);