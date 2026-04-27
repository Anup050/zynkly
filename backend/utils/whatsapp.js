const axios = require('axios');

const sendWhatsAppMessage = async (to, message) => {
  const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const headers = {
    Authorization: `Bearer ${process.env.WHATSAPP_CLOUD_API_TOKEN}`,
    'Content-Type': 'application/json',
  };
  const data = {
    messaging_product: 'whatsapp',
    to: to.replace(/\D/g, ''),
    type: 'text',
    text: { body: message },
  };

  try {
    await axios.post(url, data, { headers });
  } catch (error) {
    console.error('WhatsApp send error:', error.response?.data || error.message);
  }
};

const sendOrderToWhatsAppGroup = async (order) => {
  const message = [
    '🆕 *New Cleaning Request*',
    `Order ID: ${order._id}`,
    `Customer: ${order.customerName}`,
    `Room: ${order.roomNumber}, PG: ${order.pgName}`,
    `Mobile: ${order.mobileNumber}`,
    `Services: ${order.services.map((s) => s.name).join(', ')}`,
    `Status: ${order.orderStatus}`,
  ].join('\n');

  const adminNumber = process.env.WHATSAPP_ADMIN_NUMBER;
  if (adminNumber) {
    await sendWhatsAppMessage(adminNumber, message);
  }
};

module.exports = { sendWhatsAppMessage, sendOrderToWhatsAppGroup };
