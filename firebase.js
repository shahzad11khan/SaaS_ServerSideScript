const firebase = require('firebase-admin');

const serviceAccount = require("./backend-450304-firebase-adminsdk-fbsvc-7271368357.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
})



module.exports = { firebase }