const router = require('express').Router();
const Event = require('../models/Event');

// Get all events with filters
router.get('/', async (req, res) => {
    const { city, keyword, startDate, endDate } = req.query;
    let query = {};
    if (city) query.city = city;
    if (keyword) query.$or = [
    { title: new RegExp(keyword, 'i') },
    { venue: new RegExp(keyword, 'i') },
    { description: new RegExp(keyword, 'i') }
    ];
    const events = await Event.find(query).sort({ lastScraped: -1 });
    res.json(events);
});

// Import event (dashboard action)
router.patch('/:id/import', async (req, res) => {
    const { importedBy, importNotes } = req.body;
    const event = await Event.findByIdAndUpdate(req.params.id, {
    status: 'imported',
    importedAt: new Date(),
    importedBy,
    importNotes
}, { new: true });
res.json(event);
});

module.exports = router;