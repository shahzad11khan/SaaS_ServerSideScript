const ReceivedPayment = require('../models/receivedPayment');
const redis = require('../services/redisClient')


// Get all received payments
exports.getReceivedPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search ? { paymentMethod: { $regex: search, $options: 'i' } } : {};

    const receivedPayments = await ReceivedPayment.find(query)
      .populate('userId') // Populate person details
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ReceivedPayment.countDocuments(query);

    await redis.set(res.locals.cacheKey, JSON.stringify({
      receivedPayments,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
    }), 'EX', 300);

    res.status(200).json({
      receivedPayments,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch received payments', error: error.message });
  }
};

exports.getReceivedPaymentById = async (req, res) => {
    try {
      const { id } = req.params;
      const receivedPay = await ReceivedPayment.findById(id);
  
      if (!receivePay) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      res.status(200).json(receivePay);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order", error: error.message });
    }
  };

// Create a received payment
exports.createReceivedPayment = async (req, res) => {
  try {
    const { paymentAmount, paymentDate, receivedFrom, paymentMethod, status } = req.body;
const userId = req.user.id;
const userName = req.user.username;
const role = req.user.role;
    const newPayment = new ReceivedPayment({
      paymentAmount,
      userId,
      userName,
      role,
      paymentDate,
      receivedFrom,
      paymentMethod,
      status,
    });

    await newPayment.save();

    res.status(201).json({ message: 'Payment received successfully', newPayment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create payment', error: error.message });
  }
};

// Update a received payment
exports.updateReceivedPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
const userName = req.user.username;
const role = req.user.role;
    const updatedPayment = await ReceivedPayment.findByIdAndUpdate(id,{
      ...req.body,
      userId,
      userName,
      role
    }, {
      new: true,
    });

    if (!updatedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({ message: 'Payment updated successfully', updatedPayment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update payment', error: error.message });
  }
};

// Delete a received payment
exports.deleteReceivedPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPayment = await ReceivedPayment.findByIdAndDelete(id);

    if (!deletedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({ message: 'Payment deleted successfully', deletedPayment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete payment', error: error.message });
  }
};
