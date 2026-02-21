const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
//const { scrapeAll } = require('./scraper/index'); 
require('./config/passport'); // we'll create this next

const app = express();
app.set("trust proxy", 1);
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'none'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// mongoose.connect(process.env.MONGO_URI)
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error(err));

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    // 🔥 Run scraper immediately on startup
    await scrapeAll();
  })
  .catch(err => console.error(err));

// Routes
app.use('/api/events', require('./routes/events'));
app.use('/api/leads',  require('./routes/leads'));
app.use('/auth',       require('./routes/auth'));

// Auto-scrape every 6 hours
const cron = require('node-cron');
const { scrapeAll } = require('./scraper/index');
cron.schedule('0 */6 * * *', () => {
console.log('Running scheduled scrape...');
scrapeAll();
});

app.listen(process.env.PORT, () => console.log(`Server on port ${process.env.PORT}`));