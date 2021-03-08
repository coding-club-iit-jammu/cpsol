const fs = require('fs');
const {google} = require('googleapis');
/**
* Describe with given media and metaData and upload it using google.drive.create method()
*/ 

function uploadFile(gauth, file_name, file_path, mime, callback) {
    const auth = gauth
    const drive = google.drive({version: 'v3', auth});
    const fileMetadata = {
      'name': file_name,
      parents: [process.env.GOOGLE_DRIVE_PARENT_FOLDER]
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