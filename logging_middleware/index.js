const express = require('express');
const mongoose = require('mongoose');
const shortUrlRoutes = require('./shorturl');
const logger = require('logger'); 
const app = express();
app.use(express.json());
app.use(logger);
mongoose.connect('mongodb://localhost:27017/urlshortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
app.use('/', shortUrlRoutes);
app.listen(3000, () => console.log("Server Perfectly Working"));
