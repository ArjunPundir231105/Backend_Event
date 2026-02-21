const router = require('express').Router();
const Lead = require('../models/Lead');

router.post('/', async (req, res) => {
    const { email, consent, eventId } = req.body;
    const lead = new Lead({ email, consent, eventId });
    await lead.save();
    res.json({ success: true });
});

module.exports = router;