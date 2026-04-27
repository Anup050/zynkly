const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { ensureAdmin } = require('../middleware/auth');

router.use(ensureAdmin);

router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);

module.exports = router;
