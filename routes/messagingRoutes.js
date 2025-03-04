// const express = require('express');
// const router = express.Router();
// const { firebase } = require('../firebase');
// const { google } = require('googleapis');

// const SCOPES = [
//   'https://www.googleapis.com/auth/firebase.messaging',
// ]
// const key = require('../backend-450304-cd0353b1e3f8.json');
//   function getAccessToken() {
//     return new Promise(function(resolve, reject) {
//       const jwtClient = new google.auth.JWT(
//         key.client_email,
//         null,
//         key.private_key,
//         SCOPES,
//         null
//       );
//       console.log(jwtClient);
//       jwtClient.authorize(function(err, tokens) {
//         if (err) {
//           reject(err);
//           return;
//         }
//         resolve(tokens.access_token);
//       });
//     });
//   };
// router.get('/test',async (req, res) => {
//  const token = await getAccessToken();
//  console.log(token)
//  res.status(200).json({ message: 'generate token' ,toke: token});
// })
// // Send Notification Directly Without Storing Token

// const sendNotification = async (deviceToken) => {
//   const accessToken = await getAccessToken();
//   const message = {
//     message: {
//       token: deviceToken,
//       notification: {
//         title: "Hello from FCM v1!",
//         body: "This is a test notification"
//       }
//     }
//   };

//   const response = await fetch(`https://fcm.googleapis.com/v1/projects/${key.project_id}/messages:send`, {
//     method: "POST",
//     headers: {
//       "Authorization": `Bearer ${accessToken}`,
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(message)
//   });

//   return response.json();
// };

// router.post('/send-notification', async (req, res) => {
//   try {
//     const sendMessage = await firebase.messaging().send( {
//       fcmToken: req.body.fcmToken,
//       notification: {
//         title: req.body.title,
//         body: req.body.body,
//       },
//     });
//    console.log(`SendMessage: ${sendMessage}`)
// const messageresult = await sendNotification();
// console.log(messageresult)
//     res.status(200).json({ message: 'Notification sent successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;
const Company = require('../models/Company')

require("dotenv").config();
const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const axios = require('axios');
const User = require('../models/User')
// Firebase Service Account Key
// const key = require('../backend-450304-cd0353b1e3f8.json');

const SCOPES = ['https://www.googleapis.com/auth/firebase.messaging'];


// API FOR SOTING TOKEN
router.post('/store-user-fcmToken-&-userId', async (req, res) => {
  try {
    const { fcmToken, userId } = req.body;

    if (!fcmToken || !userId) {
      return res.status(400).json({ error: 'FCM token and user ID are required' });
    }

    let user = await User.findOne({ _id: userId });

    if (!user) {
      let isCompany = await Company.findOne({ _id: userId });
      if(!isCompany) return res.status(400).json({ error: 'company not found' });
      user = isCompany;
    }

    user.fcmToken = fcmToken;
    await user.save();

    res.status(200).json({ message: 'FCM token stored successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
  })

// Function to Get Access Token
async function getAccessToken() {
  return new Promise((resolve, reject) => {
    // Initialize JWT Client with your service account credentials
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES
    );

    // Use JWT client to authorize and get the token
    jwtClient.authorize((err, tokens) => {
      if (err) {
        return reject(err); // If authorization fails, reject the promise
      }
      resolve(tokens.access_token); // Resolve with the access token
    });
  });
}


// Route to Generate Access Token (For Testing)
router.get('/test', async (req, res) => {
  try {
    const token = await getAccessToken();
    console.log('Access Token:', token);
    res.status(200).json({ message: 'Generated Token Successfully', token });
  } catch (error) {
    console.error('Error Generating Token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// Function to Send Notification to a Device
async function sendNotification(deviceToken) {
  try {
    
    const accessToken = await getAccessToken();
    console.log("accesstoken",accessToken)
    const message = {
      message: {
        token: deviceToken,
        notification: {
          title: 'Test Notification',
          body: 'This is a test notification from FCM v1!',
        },
      },
    };

    const response = await axios.post(
      `https://fcm.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/messages:send`,
      message,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error Sending Notification:');
    throw error;
  }
}

// Route to Send Notification
router.post('/send-notification', async (req, res) => {
  try {
    const { fcmToken } = req.body;

    if (!fcmToken) {
      return res.status(400).json({ error: 'FCM token is required' });
    }

    const messageResult = await sendNotification(fcmToken);
    console.log('Notification Response:', messageResult);

    res.status(200).json({ message: 'Notification sent successfully', result: messageResult });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});
  


module.exports = router;
