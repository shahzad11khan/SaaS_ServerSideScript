const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const axios = require("axios");
const mongoose = require("mongoose");

// Firebase Service Account Key
const key = require("../backend-450304-firebase-adminsdk-fbsvc-7271368357.json");

// Load User Model (Assuming you have an FCM token field in your User schema)
const User = mongoose.model("User", new mongoose.Schema({ fcmToken: String }));

const SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"];

// Function to Get Access Token
async function getAccessToken() {
  return new Promise((resolve, reject) => {
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES
    );

    jwtClient.authorize((err, tokens) => {
      if (err) {
        return reject(err);
      }
      resolve(tokens.access_token);
    });
  });
}

// Function to Send Notification to Multiple Devices
async function sendNotificationToAll(tokens, title, body) {
  try {
    if (!tokens.length) {
      throw new Error("No FCM tokens found in the database");
    }

    const accessToken = await getAccessToken();

    const message = {
      message: {
        notification: {
          title,
          body,
        },
        android: {
            priority: "high",  // 🔥 Ensure high priority for instant delivery
            ttl: "0s",  // 🔥 Prevents delays by ensuring immediate delivery
          },
          apns: {
            headers: {
              "apns-priority": "10",  // 🔥 High priority for iOS notifications
            },
          },
          webpush: {
            headers: {
              Urgency: "high",  // 🔥 High priority for web notifications
            },
          },
      },
    };

    // Loop through all tokens and send notifications
    const responses = await Promise.all(
      tokens.map((token) =>
        axios.post(
          `https://fcm.googleapis.com/v1/projects/${key.project_id}/messages:send`,
          { ...message, message: { ...message.message, token } },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        )
      )
    );

    return responses.map((response) => response.data);
  } catch (error) {
    console.error("Error Sending Notifications:", error);
    throw error;
  }
}

// Route to Send Custom Notification to All Users
router.post("/send-notification-to-all", async (req, res) => {
  try {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({ error: "Title and body are required" });
    }

    // Fetch all FCM tokens from the database
    const users = await User.find({}, "fcmToken");
    const fcmTokens = users.map((user) => user.fcmToken).filter(Boolean);

    if (!fcmTokens.length) {
      return res.status(400).json({ error: "No FCM tokens found" });
    }

    const messageResults = await sendNotificationToAll(fcmTokens, title, body);
    console.log("Notification Responses:", messageResults);

    res.status(200).json({
      message: "Notification sent to all users",
      results: messageResults,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
