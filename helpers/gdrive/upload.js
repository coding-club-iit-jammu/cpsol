const fs = require('fs');
const {google} = require('googleapis');
/**
* Describe with given media and metaData and upload it using google.drive.create method()
*/ 

function uploadFile(file_name, file_path, mime, callback) {
  const auth = global.gauth
    const drive = google.drive({version: 'v3', auth});
    const fileMetadata = {
      'name': file_name,
      parents: ['1gVcxy6b2S_rWiItZ3rD-zj5Epj7gi-Xj'] //TODO get from env
    };
    const media = {
      mimeType: mime,
      body: fs.createReadStream(file_path)
    };
    drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    })
    .then((response) => {
      const file_id = response.data.id
      //change permission to public 
      drive.permissions.create({
        fileId: file_id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        }
      }, () => {
        drive.files.get({
          fileId: file_id,
          fields: 'webViewLink'
          })
          .then((response) => 
              callback(response.data.webViewLink)
          )
      })
    })
  }

  module.exports = uploadFile