const firebase = require("firebase-admin")

const serviceAccount = require("./fir-messaging-9dd46-firebase-adminsdk-fbsvc-009e3f6a38.json")
const apn = require('apn')

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
})

// // Initialize APNS
// const apnProvider = new apn.Provider({
//     token: {
//       key: authKey, // Path to p8 file
//       keyId: "FXS2UN22L7",                  // Key ID from Apple Developer Console
//       teamId: "263YW846XS",                // Team ID from Apple Developer Console
//     },
//     production: false,  // Set to true for production mode
//   });
  

module.exports = { firebase }