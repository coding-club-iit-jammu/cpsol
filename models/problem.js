const mongoose = require('mongoose')
const mongoostatic = require('mongoosastic')
const schema = mongoose.Schema
const userSchema = require('./user')
const problemSchema = new schema({
    title : {
        type : String,
        required : true,
        es_indexed: true
    },
    link : {
        type : String,
        required : false,
        es_indexed: true
    },
    md : {
        type : String,
        required : false,
        es_indexed: false
    },
    video_link : {
        type : String,
        required : true,
        es_indexed: false
    },
    writeup_md : {
        type : String,
        required : false,
        es_indexed: false
    },
    uploaded_by : {
        type : userSchema,
        required : true,
        es_indexed: true
    }
})
problemSchema.plugin(mongoostatic)

const Problem = mongoose.model('Problem', problemSchema, 'problems')
module.exports = Problem