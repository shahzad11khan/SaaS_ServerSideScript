const Order = require('../models/Order');
const Product = require('../models/Product');

// Create a new order
const createOrder = async (req, res) => {
  const { products, shippingAddress, paymentMethod, orderStatus, barcode } = req.body;

  try {
    // Calculate the total amount
    let totalAmount = 0;
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found` });
      }
      totalAmount += product.productPrice * item.quantity;
    }
    const userId = req.user.id;
    // Create the order
    const order = new Order({
      userId,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      orderStatus,
      barcode
    });
    // Emit the new order event to all connected clients
    // **Emit the new order event to all connected clients**
    const io = req.app.get("io");  // **Retrieve io instance from app**
    io.emit("newOrder", order);    // Emit "newOrder" event   console.log("New order received:", order);
    await order.save();
    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'userId',
        select: 'companyId', // Fetch userName and companyId from User model
        populate: {
          path: 'companyId',
          select: 'companyName', // Fetch companyName from Company model
        },
      });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// only deliverd 
const getDeliveredOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = { status: "Delivered" };
    if (search) {
      query.productName = { $regex: search, $options: "i" };
    }

    const deliveredOrders = await Order.find(query)
      .populate('userId') // Populate customer details
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      deliveredOrders,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch delivered orders", error: error.message });
  }
};

// Get a specific order by ID
const getOrderById = async (req, res) => {
  const { Id } = req.params;

  try {
    const order = await Order.findById(Id).populate('userId').populate('products.productId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an order's status
const updateOrderStatus = async (req, res) => {
  const { Id } = req.params;
  const { orderStatus } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      Id,
      { orderStatus },
      { new: true } // Return the updated order
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  const { Id } = req.params;
// console.log(req.params);
  try {
    const order = await Order.findByIdAndDelete(Id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getDeliveredOrders,
  updateOrderStatus,
  deleteOrder,
};