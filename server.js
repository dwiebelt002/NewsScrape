//Dependencies

// Initialize Express app
var express = require('express');
var app = express();

// Require request and cheerio. This makes the scraping possible
var request = require('request');
var cheerio = require('cheerio');

var logger = require('morgan');
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

//url of the website we are scraping from
var url = "http://www.ign.com/articles/2016/08/02/death-note-willem-dafoe-joins-cast-as-ryuk?abthid=57a11db0e913ffd032000014"

//requesting cheerio
request(url, function(err, resp, html) {
	var $ =cheerio.load(html);

	$('html').each(function(i, element){

	var title = $(this).find('.article-headline')

	//setting variables for the scraped article, divided between title and article content
	var title = $('.article-headline').text();
	var article = $('.article-content').text();

	//data is pushed into results array
	var results = [];
	results.push({
		myTitle: "Article 1",
		title: title,
		article: article 
	});

	//console.log(results);

	//var articleNameText = articleName.text();

	//var articleContent = $('.article-content');
	//var articleContentText = articleContent.text();

	//console.log(articleNameText);
	//console.log(articleContentText);

	//this code inserts our article data to our html
	db.articles.insert(results, function(err, docs){
		if (err) throw err;
		res.render('index', {
				articles: docs
				});
			});
		})
	})
});

//==========================================================================================================

// simple index route
app.get('/', function(req, res) {
  res.send(index.handlebars);
});


// TODO: Fill in each route so that the server performs
// the proper mongojs functions for the site to function
// -/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/


// Post a comment to the mongoose database
app.post('/submit', function(req, res) {

  // save the request body as an object called book
  var comment = req.body;

  // if we want the object to have a boolean value of false, 
  // we have to do it here, because the ajax post will convert it 
  // to a string instead of a boolean
  comment.read = false;

  // save the comment object as an entry into the comments collection in mongo
  db.comments.insert(comment, function(err, saved) {
    // show any errors
    if (err) {
      console.log(err);
    } 
    // otherwise, send the response to the client (for AJAX success function)
    else {
      res.send(saved);
    }
  });
});


// find all books marked as read
app.get('/read', function(req, res) {
  // go into the mongo collection, and find all docs where "read" is true
  db.books.find({'read':true}, function(err, found) {
    // show any errors
    if (err) {
      console.log(err);
    } 
    // otherwise, send the books we found to the browser as a json
    else {
      res.json(found);
    }
  });
});


// find all comments marked as unread
app.get('/unread', function(req, res) {
  // go into the mongo collection, and find all docs where "read" is false
  db.comments.find({'read':false}, function(err, found) {
    // show any errors
    if (err) {
      console.log(err);
    } 
    // otherwise, send the books we found to the browser as a json
    else {
      res.json(found);
    }
  });
});


// mark a book as having been read
app.get('/markread/:id', function(req, res) {
  // Remember: when searching by an id, the id needs to be passed in 
  // as (mongojs.ObjectId(IDYOUWANTTOFIND))

  // update a doc in the books collection with an ObjectId matching
  // the id parameter in the url
  db.comments.update({
    '_id': mongojs.ObjectId(req.params.id)
  }, {
    // set "read" to true for the book we specified
    $set: {
      'read':true
    }
  }, 
  // when that's done, run this function
  function(err, edited) {
    // show any errors
    if (err) {
      console.log(err);
      res.send(err);
    } 
    // othewise, send the result of our update to the browser
    else {
      console.log(edited);
      res.send(edited);
    }
  });
});


// mark a comments as having been read
app.get('/markunread/:id', function(req, res) {
  // Remember: when searching by an id, the id needs to be passed in 
  // as (mongojs.ObjectId(IDYOUWANTTOFIND))

  // update a doc in the books collection with an ObjectId matching
  // the id parameter in the url
  db.comments.update({
    '_id': mongojs.ObjectId(req.params.id)
  }, {
    // set "read" to false for the comments we specified
    $set: {
      'read':false
    }
  }, 
  // when that's done, run this function
  function(err, edited) {
    // show any errors
    if (err) {
      console.log(err);
      res.send(err);
    } 
    // othewise, send the result of our update to the browser
    else {
      console.log(edited);
      res.send(edited);
    }
  });
});




//=============================================================================================================

// listen on port 8081
app.listen(8081, function() {
  console.log('App running on port 8081!');
});

exports = module.exports = app;

