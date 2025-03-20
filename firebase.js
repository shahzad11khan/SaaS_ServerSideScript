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



module.exports = admin; 