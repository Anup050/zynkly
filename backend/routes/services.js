const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { ensureAdmin } = require('../middleware/auth');

router.get('/', serviceController.getServices);
router.post('/', ensureAdmin, serviceController.createService);
router.put('/:id', ensureAdmin, serviceController.updateService);
router.delete('/:id', ensureAdmin, serviceController.deleteService);

module.exports = router;
