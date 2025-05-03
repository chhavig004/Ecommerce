const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createOrder,
  getOrder,
  getMyOrders,
  payOrder
} = require('../controllers/orderController');

// POST /api/orders - Create new order
router.post('/', protect, createOrder);

// GET /api/orders/:id - Get order by ID
router.get('/:id', protect, getOrder);

// GET /api/orders/myorders - Get logged in user's orders
router.get('/myorders', protect, getMyOrders);

// PUT /api/orders/:id/pay - Mark order as paid
router.put('/:id/pay', protect, payOrder);

module.exports = router;