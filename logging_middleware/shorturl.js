const express = require('express');
const router = express.Router();
const ShortUrl = require('Short');
const Click = require('Click');
const shortid = require('shortid');
const geoip = require('geoip-lite');
router.post('/shorturls', async (req, res) => {
const { url, validity = 30, shortcode } = req.body;
if (!url || !/^https?:\/\/.*/i.test(url)) 
{
    return res.status(400).json({ error: 'Invalid or missing URL' });
}
const code = shortcode || shortid.generate();
const existing = await ShortUrl.findOne({ shortcode: code });
if (existing) 
{
    return res.status(409).json({ error: 'Shortcode already in use' });
}
const expiry = new Date(Date.now() + validity * 60000);
const short = new ShortUrl
({
    shortcode: code,
    originalUrl: url,
    expiry
});
await short.save();
res.status(201).json
({
    shortLink: `http://localhost:3000/${code}`,
    expiry: expiry.toISOString()
});
});
router.get('/:shortcode', async (req, res) => 
{
  const { shortcode } = req.params;

  const short = await ShortUrl.findOne({ shortcode });

  if (!short) {
    return res.status(404).send('Short URL not found');
  }

  if (new Date() > short.expiry) {
    return res.status(410).send('This short URL has expired');
  }

  const geo = geoip.lookup(req.ip) || {};
  await Click.create({
    shortcode,
    referrer: req.get('Referer') || 'unknown',
    location: geo
});

  res.redirect(short.originalUrl);
});

router.get('/shorturls/:shortcode', async (req, res) => {
  const { shortcode } = req.params;

  const short = await ShortUrl.findOne({ shortcode });

  if (!short) {
    return res.status(404).json({ error: 'Shortcode not found' });
  }
  const clicks = await Click.find({ shortcode });
  res.json({
    shortcode,
    originalUrl: short.originalUrl,
    createdAt: short.createdAt,
    expiry: short.expiry,
    totalClicks: clicks.length,
    clickDetails: clicks.map(click => ({
      timestamp: click.timestamp,
      referrer: click.referrer,
      location: click.location
    }))
  });
});

module.exports = router;
