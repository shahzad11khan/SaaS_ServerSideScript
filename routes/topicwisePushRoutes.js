const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const axios = require("axios");

// Firebase Service Account Key
const key = require("../backend-450304-firebase-adminsdk-fbsvc-7271368357.json");

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

// Function to Send Notification to a Topic
async function sendNotificationToTopic(topic, title, body) {
  try {
    const accessToken = await getAccessToken();

    const message = {
      message: {
        topic, // Send notification to the topic
        notification: {
          title,
          body,
        },
      },
    };

    const response = await axios.post(
      `https://fcm.googleapis.com/v1/projects/${key.project_id}/messages:send`,
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
    console.error("Error Sending Topic Notification:", error);
    throw error;
  }
}

// Route to Send Notification to a Topic
router.post("/send-notification-to-topic", async (req, res) => {
  try {
    const { topic, title, body } = req.body;

    if (!topic || !title || !body) {
      return res.status(400).json({ error: "Topic, title, and body are required" });
    }

    const messageResult = await sendNotificationToTopic(topic, title, body);
    console.log("Notification Response:", messageResult);

    res.status(200).json({
      message: `Notification sent to topic "${topic}"`,
      result: messageResult,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
