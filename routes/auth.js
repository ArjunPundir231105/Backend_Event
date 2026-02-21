const router = require('express').Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173' }),
    (req, res) => res.redirect('http://localhost:5173/dashboard')
);

router.get('/me', (req, res) => {
    req.user ? res.json(req.user) : res.status(401).json({ message: 'Not logged in' });
});

router.get('/logout', (req, res) => {
    req.logout(() => res.redirect('http://localhost:5173'));
});

module.exports = router;