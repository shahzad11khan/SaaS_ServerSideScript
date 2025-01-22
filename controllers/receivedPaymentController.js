const ReceivedPayment = require('../models/receivedPayment');

// Get all received payments
exports.getReceivedPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search ? { paymentMethod: { $regex: search, $options: 'i' } } : {};

    const receivedPayments = await ReceivedPayment.find(query)
      .populate('receivedFrom', 'username') // Populate person details
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ReceivedPayment.countDocuments(query);

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

    const newPayment = new ReceivedPayment({
      paymentAmount,
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
    const updatedPayment = await ReceivedPayment.findByIdAndUpdate(id, req.body, {
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
