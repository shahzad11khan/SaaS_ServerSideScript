const express = require('express');
const Stripe = require('stripe');
require('dotenv').config();
// Replace with your Stripe secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Create a payment intent
router.post('/create-payment', async (req, res) => {
  try {
    console.log('body' , req.body)
    const { amount, currency } = req.body; 

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'], 
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret, 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
