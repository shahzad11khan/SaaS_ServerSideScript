const admin = require("firebase-admin");

const serviceAccount = require("./backend-ce65b-firebase-adminsdk-3rjh6-5b580b99e1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
