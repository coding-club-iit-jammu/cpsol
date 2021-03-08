require('dotenv').config()
const express = require('express')
const routes = require('./routes')
const fileUpload = require('express-fileupload')
const mongoose = require('mongoose')
const auth_service = require('./helpers').auth
const gdrive = require('./helpers/gdrive')
const app = express()
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './tmp/'
  }))
app.use(routes)
app.use(express.static('./public'))


gdrive.gdriveInit(() => {
  mongoose.connect(process.env.DB_URL, {useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex : true})
    .then((result) => {
        console.log('Connected to Database')
        auth_service.initialize()
        app.listen(3000, () => {
          console.log('started ...')
      })
    })
    .catch((err) => console.log(err))
})


