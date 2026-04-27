exports.getCart = (req, res) => {
  if (!req.session.cart) req.session.cart = [];
  res.status(200).json(req.session.cart);
};

exports.addToCart = (req, res) => {
  const { serviceId, name } = req.body;
  if (!serviceId || !name) {
    return res.status(400).json({ message: 'serviceId and name are required.' });
  }
  if (!req.session.cart) req.session.cart = [];
  const exists = req.session.cart.some((item) => String(item.serviceId) === String(serviceId));
  if (exists) {
    return res.status(400).json({ message: 'Service already in cart.' });
  }
  req.session.cart.push({ serviceId, name });
  res.status(200).json({ message: 'Added to cart.', cart: req.session.cart });
};

exports.removeFromCart = (req, res) => {
  const { id } = req.params;
  if (!req.session.cart) req.session.cart = [];
  req.session.cart = req.session.cart.filter((item) => String(item.serviceId) !== String(id));
  res.status(200).json({ message: 'Removed from cart.', cart: req.session.cart });
};

exports.clearCart = (req, res) => {
  req.session.cart = [];
  res.status(200).json({ message: 'Cart cleared.', cart: [] });
};
