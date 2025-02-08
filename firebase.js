const firebase = require('firebase-admin');

const serviceAccount = require("./backend-450304-firebase-adminsdk-fbsvc-7271368357.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// module.exports = admin;


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