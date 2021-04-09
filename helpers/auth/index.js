var admin = require("firebase-admin")

var serviceAccount = require(process.env.FIREBASE_ADMIN_CREDENTIALS)

const initialize = () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DB_URL
    })
}

const extract_auth = (req, res, next) => {
    // Verify the ID token while checking if the token is revoked by passing
    // checkRevoked true.
    const {id_token} = req.body
    let check_revoked = true;
    admin
    .auth()
    .verifyIdToken(id_token, check_revoked)
    .then((payload) => {
        // Token is valid.
        req.uploaded_by = {
            uid : payload.uid,
            name : payload.name,
            email : payload.email
        }
        next()
    })
    .catch((error) => {
        console.log(error)
        if (error.code == 'auth/id-token-revoked') {
            return res.redirect('/signout.html')
        } else {
            return res.redirect('/login.html')
        }
    });
}

module.exports = {
    initialize,
    extract_auth
}

