const express = require('express')
const routes = require('./routes')
const fileUpload = require('express-fileupload')
const mongoose = require('mongoose')

const app = express()
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './tmp/'
  }))
app.use(routes)


global.gauth
const gdrive = require('./helpers/gdrive')
gdrive.gdriveInit(() => {
  mongoose.connect("mongodb://localhost:27017/cpsol", {useNewUrlParser : true, useUnifiedTopology : true})
    .then((result) => {
        console.log('Connected to Database')
        app.listen(3000, () => {
          console.log('started ...')
      })
    })
    .catch((err) => console.log(err))
})


