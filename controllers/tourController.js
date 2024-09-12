const Tour = require('../models/Tour');
    const Property = require('../models/Property');

    exports.scheduleTour = async (req, res) => {
      const { propertyId, date } = req.body;
      try {
        const property = await Property.findById(propertyId);
        if (!property) {
          return res.status(404).json({ message: 'Property not found' });
        }

        const tour = new Tour({
          property: propertyId,
          buyer: req.user.id,
          date,
        });
        await tour.save();
        res.json(tour);
      } catch (err) {
        res.status(500).json({ message: 'Server error' });
      }
    };

    exports.getTours = async (req, res) => {
      try {
        const tours = await Tour.find().populate('property', 'title location').populate('buyer', 'name email');
        res.json(tours);
      } catch (err) {
        res.status(500).json({ message: 'Server error' });
      }
    };

    exports.getTour = async (req, res) => {
      try {
        const tour = await Tour.findById(req.params.id).populate('property', 'title location').populate('buyer', 'name email');
        if (!tour) {
          return res.status(404).json({ message: 'Tour not found' });
        }
        res.json(tour);
      } catch (err) {
        res.status(500).json({ message: 'Server error' });
      }
    };

    exports.updateTour = async (req, res) => {
      const { date, status } = req.body;
      try {
        let tour = await Tour.findById(req.params.id);
        if (!tour) {
          return res.status(404).json({ message: 'Tour not found' });
        }

        tour.date = date || tour.date;
        tour.status = status || tour.status;

        await tour.save();
        res.json(tour);
      } catch (err) {
        res.status(500).json({ message: 'Server error' });
      }
    };

    exports.deleteTour = async (req, res) => {
      try {
        let tour = await Tour.findById(req.params.id);
        if (!tour) {
          return res.status(404).json({ message: 'Tour not found' });
        }

        await tour.remove();
        res.json({ message: 'Tour removed' });
      } catch (err) {
        res.status(500).json({ message: 'Server error' });
      }
    };