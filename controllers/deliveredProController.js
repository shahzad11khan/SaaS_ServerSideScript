const DeliveredProduct = require('../models/delivered');

exports.getDeliveredProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search ? { productName: { $regex: search, $options: 'i' } } : {};

    const deliveredProducts = await DeliveredProduct.find(query)
      .populate('deliveredTo', 'username') // Populate person details
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await DeliveredProduct.countDocuments(query);

    res.status(200).json({
      deliveredProducts,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch delivered products', error: error.message });
  }
};

exports.getDeliveredProById = async (req, res) => {
  try {
    const { id } = req.params;
    const deliveredPro = await DeliveredProduct.findById(id);

    if (!deliveredPro) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(deliveredPro);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
};

exports.createDeliveredProduct = async (req, res) => {
  try {
    const { productName, quantity, deliveredTo, deliveryDate, status } = req.body;
    const userId = req.user.id;

    const newDeliveredProduct = new DeliveredProduct({
      userId,
      productName,
      quantity,
      deliveredTo,
      deliveryDate,
      status,
    });

    await newDeliveredProduct.save();

    res.status(201).json({ message: 'Delivered product created successfully', newDeliveredProduct });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create delivered product', error: error.message });
  }
};

exports.updateDeliveredProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, quantity, deliveredTo, deliveryDate, status } = req.body;

    const userId = req.user.id;

    const updatedDeliveredProduct = await DeliveredProduct.findByIdAndUpdate(id, {
      productName, quantity, deliveredTo, deliveryDate, status,userId,
    },{
      new: true,
    });

    if (!updatedDeliveredProduct) {
      return res.status(404).json({ message: 'Delivered product not found' });
    }

    res.status(200).json({ message: 'Delivered product updated successfully', updatedDeliveredProduct });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update delivered product', error: error.message });
  }
};

exports.deleteDeliveredProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDeliveredProduct = await DeliveredProduct.findByIdAndDelete(id);

    if (!deletedDeliveredProduct) {
      return res.status(404).json({ message: 'Delivered product not found' });
    }

    res.status(200).json({ message: 'Delivered product deleted successfully', deletedDeliveredProduct });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete delivered product', error: error.message });
  }
};
