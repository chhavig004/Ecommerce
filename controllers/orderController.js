const Order = require('../models/Order');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;
    const user = req.user._id;

    // Basic validation
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ error: "No order items" });
    }

    // Calculate total price (simplified)
    const itemsPrice = orderItems.reduce(
      (total, item) => total + (item.price * item.quantity), 0
    );
    const taxPrice = itemsPrice * 0.15; // 15% tax
    const shippingPrice = itemsPrice > 1000 ? 0 : 50; // Free shipping over $1000
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    // Create order
    const order = new Order({
      user,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);

  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get order by ID
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    console.error("Get order failed:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all orders for current user
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    console.error("Get my orders failed:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Mark order as paid
const payOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error("Payment failed:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createOrder,
  getOrder,
  getMyOrders,
  payOrder
};