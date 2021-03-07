const mongoose = require('mongoose')
const schema = mongoose.Schema

const userSchema = new schema({
    uid : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : false
    },
    email : {
        type : String,
        required : false
    }
})
module.exports = userSchema