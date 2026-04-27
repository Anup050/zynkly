const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { ensureAuth } = require('../middleware/auth');

router.get('/', ensureAuth, cartController.getCart);
router.post('/add', ensureAuth, cartController.addToCart);
router.delete('/remove/:id', ensureAuth, cartController.removeFromCart);
router.delete('/clear', ensureAuth, cartController.clearCart);

module.exports = router;
