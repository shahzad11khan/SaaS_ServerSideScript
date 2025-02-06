const admin = require("firebase-admin");

const serviceAccount = require("./fir-messaging-9dd46-firebase-adminsdk-fbsvc-91ef362573.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
