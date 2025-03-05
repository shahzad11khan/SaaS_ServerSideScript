
const Company = require('../models/Company')
require("dotenv").config();
const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const axios = require('axios');
const User = require('../models/User')
// Firebase Service Account Key
// const key = require('../backend-450304-dc32184fdb02.json');

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
    const jwtClient =  new google.auth.JWT(
      // key.client_email,
      process.env.FIREBASE_CLIENT_EMAIL,
      null,
      // key.private_key,
      process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
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
async function sendNotification(deviceToken , notificationTitle , notificationBody) {
  try {
    
    const accessToken = await getAccessToken();
    const message = {
      message: {
        token: deviceToken,
        notification: {
          title: notificationTitle,
          body: notificationBody,
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
    const { fcmToken , title , body } = req.body;

    if(!title && !body){
      return res.status(400).json({ error: 'title or body is not fill correctly' });
    }

    if (!fcmToken) {
      return res.status(400).json({ error: 'FCM token is required' });
    }

    const messageResult = await sendNotification(fcmToken , title , body);
    console.log('Notification Response:', messageResult);

    res.status(200).json({ message: 'Notification sent successfully', result: messageResult });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});
  
// Function to Send Notifications to All Users
async function sendNotificationToAll(tokens, title, body) {
  try {
    if (!tokens.length) throw new Error("No FCM tokens found");

    const accessToken = await getAccessToken();
    const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
    const url = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;

    const message = {
      notification: { title, body },
      android: { priority: "high", ttl: "0s" },
      apns: { headers: { "apns-priority": "10" } },
      webpush: { headers: { Urgency: "high" } },
    };

    const responses = await Promise.all(
      tokens.map((token) =>
        axios.post(
          url,
          { message: { ...message, token } },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        )
      )
    );

    return responses.map((res) => res.data);
  } catch (error) {
    console.error("Error Sending Notifications:", error.response?.data.error.details || error.message);
    throw error;
  }
}

// API to Send Notification to All Users
router.post("/send-notification-to-all-users", async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) return res.status(400).json({ error: "Title and body are required" });

    const users = await User.find({}, "fcmToken");
    // console.log(users)
    const fcmTokens = users.map((user) => user.fcmToken).filter(Boolean);
    // console.log("fcmTokens",fcmTokens)
    if (!fcmTokens.length) return res.status(400).json({ error: "No FCM tokens found" });

    const messageResults = await sendNotificationToAll(fcmTokens, title, body);
    res.status(200).json({ message: "Notification sent to all users", results: messageResults });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to Send Notification to All Company
router.post("/send-notification-to-all-companies", async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) return res.status(400).json({ error: "Title and body are required" });

    const companies = await Company.find({}, "fcmToken");
    // console.log(companies)
    const fcmTokens = companies.map((company) => company.fcmToken).filter(Boolean);
    // console.log("fcmTokens",fcmTokens)
    if (!fcmTokens.length) return res.status(400).json({ error: "No FCM tokens found" });

    const messageResults = await sendNotificationToAll(fcmTokens, title, body);
    res.status(200).json({ message: "Notification sent to all users", results: messageResults });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
