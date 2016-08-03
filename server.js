//Dependencies

// Initialize Express app
var express = require('express');
var app = express();

// Require request and cheerio. This makes the scraping possible
var request = require('request');
var cheerio = require('cheerio');

var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');

// Database configuration
var mongojs = require('mongojs');
var databaseUrl = "webscrapeDB";
var collections = ["articles", "comments"];

//connect mongojs to db variable
var db = mongojs(databaseUrl, collections);
db.on('error', function(err) {
  console.log('Database Error:', err);
});

//setting up handlebars
var expressHandlebars = require('express-handlebars');
app.engine('handlebars', expressHandlebars({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//======================================================================================================


// Main route
app.get('/', function(req, res) {


var url = "http://www.ign.com/articles/2016/08/02/death-note-willem-dafoe-joins-cast-as-ryuk?abthid=57a11db0e913ffd032000014"

request(url, function(err, resp, html) {
	var $ =cheerio.load(html);

	$('html').each(function(i, element){

	var title = $(this).find('.article-headline')

	var title = $('.article-headline').text();
	var article = $('.article-content').text();

	var results = [];
	results.push({
		myTitle: "Article 1",
		title: title,
		article: article 
	});

	console.log(results);

	//var articleNameText = articleName.text();

	//var articleContent = $('.article-content');
	//var articleContentText = articleContent.text();

	//console.log(articleNameText);
	//console.log(articleContentText);

	db.articles.insert(results, function(err, docs){
		if (err) throw err;
		res.render('index', {
				articles: docs
				});
			});
		})
	})
});

// listen on port 8081
app.listen(8081, function() {
  console.log('App running on port 8081!');
});

exports = module.exports = app;

