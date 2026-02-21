const axios = require('axios');
const crypto = require('crypto');
const Event = require('../models/Event');

const TM_API_KEY = process.env.TICKETMASTER_API_KEY;

function hashContent(event) {
  const str = `${event.title}${event.date}${event.venue}`;
  return crypto.createHash('md5').update(str).digest('hex');
}

async function scrapeTicketmaster() {
  console.log('Scraping Ticketmaster...');
  
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?city=Sydney&countryCode=AU&size=50&apikey=${TM_API_KEY}`;

  
  const response = await axios.get(url);
  const rawEvents = response.data?._embedded?.events || [];

  for (const e of rawEvents) {
    const data = {
      title:         e.name,
      date:          e.dates?.start?.dateTime || e.dates?.start?.localDate,
      venue:         e._embedded?.venues?.[0]?.name || '',
      address:       e._embedded?.venues?.[0]?.address?.line1 || '',
      city:          'Sydney',
      description:   e.info || e.pleaseNote || '',
      category:      e.classifications?.[0]?.segment?.name || '',
      imageUrl:      e.images?.[0]?.url || '',
      sourceWebsite: 'Ticketmaster',
      originalUrl:   e.url,
      lastScraped:   new Date(),
    };
    data.contentHash = hashContent(data);

    const existing = await Event.findOne({ originalUrl: data.originalUrl });
    if (!existing) {
      await Event.create({ ...data, status: 'new' });
    } else if (existing.contentHash !== data.contentHash) {
      await Event.findByIdAndUpdate(existing._id, { ...data, status: 'updated' });
    } else {
      await Event.findByIdAndUpdate(existing._id, { lastScraped: new Date() });
    }
  }
  console.log(`Ticketmaster: processed ${rawEvents.length} events`);
}

async function markInactiveEvents() {
  const cutoff = new Date(Date.now() - 12 * 60 * 60 * 1000); // 12 hours
  await Event.updateMany(
    { lastScraped: { $lt: cutoff }, status: { $ne: 'inactive' } },
    { status: 'inactive' }
  );
}

async function scrapeAll() {
  await scrapeTicketmaster();
  await markInactiveEvents();
}

module.exports = { scrapeAll };