const mongoose = require('mongoose');
const ShortUrlSchema = new mongoose.Schema({
  shortcode: { type: String, unique: true, required: true },
  originalUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiry: { type: Date, required: true }
});
module.exports = mongoose.model('ShortUrl', ShortUrlSchema);
