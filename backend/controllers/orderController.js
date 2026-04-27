const Order = require('../models/Order');
const User = require('../models/User');
const { sendOrderConfirmationEmail } = require('../utils/email');
const { sendOrderToWhatsAppGroup } = require('../utils/whatsapp');

exports.placeOrder = async (req, res) => {
  const { services, customerName, roomNumber, pgName, mobileNumber } = req.body;
  const userId = req.user.id;

  if (!services?.length || !customerName || !roomNumber || !pgName || !mobileNumber) {
    return res.status(400).json({ message: 'Missing required fields: services, customerName, roomNumber, pgName, mobileNumber.' });
  }

  try {
    const order = await Order.create({
      userId,
      services,
      customerName,
      roomNumber,
      pgName,
      mobileNumber,
    });

    const user = await User.findById(userId);
    if (user?.email) {
      try {
        await sendOrderConfirmationEmail(user.email, order);
      } catch (e) {
        console.error('Confirmation email error:', e);
      }
    }

    try {
      await sendOrderToWhatsAppGroup(order);
    } catch (e) {
      console.error('WhatsApp send error:', e);
    }

    if (req.session.cart) req.session.cart = [];

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ orderDate: -1 }).populate('services.serviceId', 'name description');
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ orderDate: -1 }).populate('userId', 'name email').populate('services.serviceId', 'name');
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id).populate('userId', 'name email mobileNumber').populate('services.serviceId', 'name');
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ['Pending', 'Accepted', 'Completed', 'Cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }
  try {
    const order = await Order.findByIdAndUpdate(id, { orderStatus: status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};
