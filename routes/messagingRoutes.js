const express = require('express');
const router = express.Router();
const admin = require('../firebase');

// Send Notification Directly Without Storing Token
router.post('/send-notification', async (req, res) => {
  const { fcmToken, title, body } = req.body;

  if (!fcmToken) {
    return res.status(400).json({ message: 'FCM token is required' });
  }
  try {
    const message = {
      notification: { title, body },
      token: fcmToken,
    };

    await admin.messaging().send(message);
    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
