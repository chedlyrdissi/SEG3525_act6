// Entry point for the application

// express application
var express = require('express');
// require the controller we make
var c = require('./controllers/MainController');
var controller = c.controller;

var app = express();

// set up template engine
app.set('view engine', 'ejs');

// static file serving
app.use(express.static('./public'));
// fire function from surveyController
controller(app);

// listen to port
app.listen(3000);
console.log('listening port 3000');