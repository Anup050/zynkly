const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { ensureAuth, ensureAdmin } = require('../middleware/auth');

router.post('/', ensureAuth, orderController.placeOrder);
router.get('/my-orders', ensureAuth, orderController.getMyOrders);

router.get('/all', ensureAdmin, orderController.getAllOrders);
router.get('/:id', ensureAdmin, orderController.getOrderById);
router.put('/:id/status', ensureAdmin, orderController.updateOrderStatus);

module.exports = router;
