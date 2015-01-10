/*
	(c) 2015 Gautam Mittal
*/

var express = require('express');
var app = express();


var port = 8081;


app.use(express.static(__dirname + ""));

app.use(function(req, res, next) {
  if (/\/hidden\/*/.test(req.path)) {
    return res.send(404, "Not Found"); // or 403, etc
  }
  next();
});

app.get('/search/:search_query', function (req, res) {
	console.log(req.param("search_query").toLowerCase());
	var id = req.param("search_query").toLowerCase();

	res.send('Hello World!');
});

app.get('/id/:youtube_id', function (req, res) {
	console.log(req.param("youtube_id").toLowerCase());
	var id = req.param("youtube_id").toLowerCase();

	res.send(req.param("youtube_id"));

});

app.get('/url/:youtube_url', function (req, res) {
	console.log(req.param("youtube_url").toLowerCase());
	var id = req.param("youtube_url").toLowerCase();

	res.send(req.param("youtube_url"));

});

app.listen(port);



console.log('Listening on port ' + port);
