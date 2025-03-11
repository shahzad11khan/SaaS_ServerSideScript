const admin = require('firebase-admin');

const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // 🔥 Fix line breaks
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  };

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// module.exports = admin;


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
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
  

module.exports = admin; 