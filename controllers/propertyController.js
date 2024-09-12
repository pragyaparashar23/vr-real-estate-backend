const Property = require('../models/Property');

exports.createProperty = async (req, res) => {
  const { title, description, price, location, images } = req.body;
  try {
    const property = new Property({
      title,
      description,
      price,
      location,
      images,
      agent: req.user.id,
    });
    await property.save();
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('agent', 'name email');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('agent', 'name email');
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProperty = async (req, res) => {
  const { title, description, price, location, images } = req.body;
  try {
    let property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.title = title || property.title;
    property.description = description || property.description;
    property.price = price || property.price;
    property.location = location || property.location;
    property.images = images || property.images;

    await property.save();
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await property.remove();
    res.json({ message: 'Property removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
