const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  services: [
    {
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
      name: { type: String, required: true },
    },
  ],
  customerName: { type: String, required: true },
  roomNumber: { type: String, required: true },
  pgName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Accepted', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  orderDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
