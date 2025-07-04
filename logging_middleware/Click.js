const mongoose = require('mongoose');
const ClickSchema = new mongoose.Schema({
  shortcode: String,
  timestamp: { type: Date, default: Date.now },
  referrer: String,
  location: Object,
});
module.exports = mongoose.model('Click', ClickSchema);
