const router = require('express').Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: process.env.CLIENT_URL }),
    (req, res) => res.redirect(process.env.CLIENT_URL + '/dashboard')
);

router.get('/me', (req, res) => {
    req.user ? res.json(req.user) : res.status(401).json({ message: 'Not logged in' });
});

router.get('/logout', (req, res) => {
    req.logout(() => res.redirect(process.env.CLIENT_URL));
});

module.exports = router;