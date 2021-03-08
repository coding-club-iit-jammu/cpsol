const _gdriveInit = require('./init')
const _uploadFile = require('./upload')

var gauth

const gdriveInit = (callback) => {
  return _gdriveInit((auth) => {
    gauth = auth
    callback()
  })
}
const uploadFile = (file_name, file_path, mime, callback) => {
  return _uploadFile(gauth, file_name, file_path, mime, callback)
}

module.exports = {
  gdriveInit,
  uploadFile
}