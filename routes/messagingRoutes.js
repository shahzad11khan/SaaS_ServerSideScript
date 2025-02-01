const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
router.post("/send-notification", async (req, res) => {
    const { token, title, body } = req.body;
  
    if (!token || !title || !body) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
  
    const message = {
      notification: {
        title,
        body,
      },
      token, // FCM Device Token
    };
  
    try {
      const response = await admin.messaging().send(message);
      console.log("Notification sent:", response);
      res.status(200).json({ success: true, message: "Notification sent successfully", response });
    } catch (error) {
      console.error("Error sending notification:", error);
      res.status(500).json({ success: false, message: "Failed to send notification", error });
    }
  });
  
  module.exports = router;