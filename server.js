//Dependencies

// Initialize Express app
var express = require('express');
var app = express();

// Require request and cheerio. This makes the scraping possible
var request = require('request');
var cheerio = require('cheerio');

var bodyParser = require('body-parser');
var expressHandlebars = require('express-handlebars');
var path = require('path');

// Database configuration
var mongojs = require('mongojs');
var databaseUrl = "webscrapeDB";
var collections = ["articles", "comments"];

// Main route (simple Hello World Message)
app.get('/', function(req, res) {
  res.send("Hello world");
});

// listen on port 8081
app.listen(8081, function() {
  console.log('App running on port 8081!');
});

exports = module.exports = app;

