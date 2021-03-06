const mongoose = require('mongoose')
const schema = mongoose.Schema

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
    }
})

const Problem = mongoose.model('Problem', problemSchema)
module.exports = Problem