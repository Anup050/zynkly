const Service = require('../models/Service');

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({});
    res.status(200).json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.createService = async (req, res) => {
  const { name, description, imageUrl, duration } = req.body;
  try {
    const service = await Service.create({ name, description, imageUrl, duration });
    res.status(201).json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateService = async (req, res) => {
  const { id } = req.params;
  const { name, description, imageUrl, duration } = req.body;
  try {
    const service = await Service.findByIdAndUpdate(id, { name, description, imageUrl, duration }, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    res.status(200).json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findByIdAndDelete(id);
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    res.status(200).json({ message: 'Service removed.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};
