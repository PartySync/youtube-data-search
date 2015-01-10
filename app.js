/*
	(c) 2015 Gautam Mittal
*/

var express = require('express');
var request = require('request');
var numeral = require('numeral');

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
	request('http://suggestqueries.google.com/complete/search?hl=en&ds=yt&client=youtube&hjson=t&q='+ req.param("search_query") +'&cp=1', function (err, response, body) {
		var suggested_queries = [];
		for (var i = 0; i < JSON.parse(body)[1].length; i++) {

			suggested_queries.push(JSON.parse(body)[1][i][0]); // add the suggested query
		}

		console.log(suggested_queries);

		request('http://gdata.youtube.com/feeds/api/videos?q='+ req.param("search_query") +'&format=5&max-results=1&v=2&alt=jsonc', function (err101, response101, body101) {
			var gdata = {};
			gdata["title"] = JSON.parse(body101).data.items[0].title;
			gdata["description"] = JSON.parse(body101).data.items[0].description;
			gdata["uploader"] = JSON.parse(body101).data.items[0].uploader;
			gdata["category"] = JSON.parse(body101).data.items[0].category;
			gdata["video_id"] = JSON.parse(body101).data.items[0].id;
			gdata["video_url"] = "http://www.youtube.com/watch?v=" + JSON.parse(body101).data.items[0].id;
			gdata["thumbnails"] = {
				'small': JSON.parse(body101).data.items[0].thumbnail.sqDefault,
				'large': JSON.parse(body101).data.items[0].thumbnail.hqDefault
			};
			gdata["duration"] = JSON.parse(body101).data.items[0].duration;
			var prettyDurationMin = Math.floor((JSON.parse(body101).data.items[0].duration)/60);
			var prettyDurationSeconds = (JSON.parse(body101).data.items[0].duration)%60;
			gdata["pretty_duration"] = prettyDurationMin.toString() + ":"+ prettyDurationSeconds.toString();
			// gdata["duration"] = JSON.parse(body101).data.items[0].duration;
			gdata["views"] = JSON.parse(body101).data.items[0].viewCount;
			gdata["pretty_views"] = numeral(JSON.parse(body101).data.items[0].viewCount).format('0,0');
			gdata["rate"] = JSON.parse(body101).data.items[0].rating;
			
				


			res.set('Content-Type', 'application/json');
			res.send(JSON.stringify({'suggested_searches': suggested_queries, 'data': gdata}));
		});


		
		
		

	});


	
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
