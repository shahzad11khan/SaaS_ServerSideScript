const Order = require("../models/order");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    // const { user, items, totalAmount, shippingAddress } = req.body;
    const {  items, totalAmount, shippingAddress } = req.body;

    if (!items || !totalAmount || !shippingAddress) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const order = new Order({
    //   user,
      items,
      totalAmount,
      shippingAddress,
    });

    await order.save();
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

// Get all orders
// exports.getOrders = async (req, res) => {
//   try {
//     const orders = await Order.find().populate("user").populate("items.product");
//     res.status(200).json(orders);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch orders", error: error.message });
//   }
// };
exports.getOrders = async (req, res) => {
    try {
      const { page = 1, limit = 10, sortBy = 'user', order = 'asc', search = '' } = req.query;
  
      const sortOrder = order === 'desc' ? -1 : 1;
      // Build search query for userName
      const searchQuery = search
        ? { "user.username": { $regex: search, $options: 'i' } }  // Searching by userName
        : {};
  
      // Aggregate orders with user details populated (using $lookup)
      const orders = await Order.aggregate([
        { $match: searchQuery },
        {
          $lookup: {
            from: "users",  // The collection to join with (User collection)
            localField: "user",  // The field in the Order model that references the User model
            foreignField: "_id",  // The field in the User model that is the ObjectId
            as: "userDetails"  // Alias for the joined data
          }
        },
        {
          $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true }  // Unwind to make the user data available
        },
        { $sort: { [sortBy]: sortOrder } },
        { $skip: (page - 1) * limit },
        { $limit: parseInt(limit) }
      ]);
  
      // Count total orders
      const orderCount = await Order.aggregate([
        { $match: searchQuery },
        { $count: "totalOrders" }
      ]);
  
      res.status(200).json({
        orders,
        orderCount: orderCount.length > 0 ? orderCount[0].totalOrders : 0,
        currentPage: parseInt(page),
        totalPages: Math.ceil(orderCount.length > 0 ? orderCount[0].totalOrders / limit : 1)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
  };
  
// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate("user").populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order", error: error.message });
  }
};
