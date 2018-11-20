const express = require('express');
const authRoutes = require('./routes/auth-routes');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

mongoose.connect(keys.mongodb.URI, ()=>{
})

// set up route
app.use('/auth', authRoutes);

module.exports = app;
