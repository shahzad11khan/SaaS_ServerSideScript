const express = require("express");
const {createOrder,getOrders,getOrderById,updateOrderStatus,deleteOrder,} = require("../controllers/orderController");
const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.patch("/:id", updateOrderStatus);
router.delete("/:id", deleteOrder);

module.exports = router;
