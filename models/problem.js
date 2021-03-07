const mongoose = require('mongoose')
const schema = mongoose.Schema
const userSchema = require('./user')
const problemSchema = new schema({
    title : {
        type : String,
        required : true
    },
    link : {
        type : String,
        required : false
    },
    md : {
        type : String,
        required : false
    },
    video_link : {
        type : String,
        required : true
    },
    writeup_md : {
        type : String,
        required : false
    },
    uploaded_by : {
        type : userSchema,
        required : true
    }
})
problemSchema.index({
    title : 'text'
})
const Problem = mongoose.model('Problem', problemSchema)
module.exports = Problem