const Tattoo = require('../models/tatoo');

// Create a new tattoo
exports.createTattoo = async (req, res) => {
    try {
        const { imgUrl, title } = req.body;

        // Manual validation
        if (!imgUrl || !title) {
          return res.status(400).json({ message: 'All fields are required' });
        }
        const tattoo = new Tattoo({ imgUrl, title });
        await tattoo.save();
        res.status(201).json(tattoo);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// Get all tattoos
exports.getAllTattoos = async (req, res) => {
    try {
        const tattoos = await Tattoo.find();
        res.status(200).send(tattoos);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// Get a single tattoo by ID
exports.getTattooById = async (req, res) => {
    try {
        const tattoo = await Tattoo.findById(req.params.id);
        if (!tattoo) return res.status(404).send('Tattoo not found');
        res.status(200).send(tattoo);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// Update a tattoo
exports.updateTattoo = async (req, res) => {
    try {
        const tattoo = await Tattoo.findByIdAndUpdate(
            req.params.id,
            { imgUrl: req.body.imgUrl, title: req.body.title },
            { new: true }  // Returns the updated document
        );
        if (!tattoo) return res.status(404).send('Tattoo not found');
        res.status(200).send(tattoo);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// Delete a tattoo
exports.deleteTattoo = async (req, res) => {
    try {
        const tattoo = await Tattoo.findByIdAndDelete(req.params.id);
        if (!tattoo) return res.status(404).send('Tattoo not found');
        res.status(200).send('Tattoo deleted');
    } catch (err) {
        res.status(400).send(err.message);
    }
};
