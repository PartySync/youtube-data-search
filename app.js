/*
	(c) 2015 Gautam Mittal
	Under GNU GPL v3
*/

var dotenv = require('dotenv');
dotenv.load();


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

app.get('/search/:search_query/:num_results', function (req, res) {
	request('http://suggestqueries.google.com/complete/search?hl=en&ds=yt&client=youtube&hjson=t&q='+ req.param("search_query") +'&cp=1', function (err, response, body) {

		var suggested_queries = [];
		if (JSON.parse(body)[1].length != 0) {
					for (var i = 0; i < JSON.parse(body)[1].length; i++) {

						suggested_queries.push(JSON.parse(body)[1][i][0]); // add the suggested query
					}

					console.log(suggested_queries);

					request('https://www.googleapis.com/youtube/v3/search?safeSearch=moderate&part=snippet&q='+req.param("search_query")+'&maxResults='+ req.param("num_results") +'&key='+ process.env.YOUTUBE_API_KEY, function (err101, response101, body101) {
						var items = [];
						console.log(body101)
						// console.log(data.items.length)

						for (var j = 0; j < JSON.parse(body101).items.length; j++) {
								var gdata = {};
								gdata["title"] = JSON.parse(body101).items[j].title;
								gdata["description"] = JSON.parse(body101).items[j].snippet.description;
								gdata["uploader"] = JSON.parse(body101).items[j].snippet.channelTitle;
								gdata["category"] = JSON.parse(body101).items[j].category;
								gdata["video_id"] = JSON.parse(body101).items[j].id.videoId;
								gdata["video_url"] = "http://www.youtube.com/watch?v=" + JSON.parse(body101).items[j].id;
								gdata["thumbnails"] = {
									'small': JSON.parse(body101).items[j].snippet.thumbnails.default.url,
									'large': JSON.parse(body101).items[j].snippet.thumbnails.high.url
								};
								gdata["duration"] = JSON.parse(body101).items[j].duration;
								var prettyDurationMin = Math.floor((JSON.parse(body101).items[j].duration)/60);
								var prettyDurationSeconds = (JSON.parse(body101).items[j].duration)%60;
								if (prettyDurationSeconds < 10) {
									prettyDurationSeconds = "0" + prettyDurationSeconds.toString();
								}

								gdata["pretty_duration"] = prettyDurationMin.toString() + ":"+ prettyDurationSeconds.toString();
								// gdata["duration"] = JSON.parse(body101).data.items[0].duration;
								gdata["views"] = JSON.parse(body101).items[j].viewCount;
								gdata["pretty_views"] = numeral(JSON.parse(body101).items[j].viewCount).format('0,0');
								gdata["rate"] = JSON.parse(body101).items[j].rating;

								items.push(gdata);

						}			

						
						
							


						res.set('Content-Type', 'application/json');
						res.send(JSON.stringify({'suggested_searches': suggested_queries, 'data': items}));
					});

		} else {
			res.set('Content-Type', 'application/json');
			res.send(JSON.stringify({'error': 'Could not find what you were looking for!'}));
		}

		
		


		
		
		

	});


	
});

app.get('/id/:youtube_id', function (req, res) {
	request('http://gdata.youtube.com/feeds/api/videos/'+ req.param('youtube_id') +'?v=2&alt=jsonc', function (err, response, body101) {
		if (typeof JSON.parse(body101).data !== 'undefined') {
			var gdata = {};
			gdata["title"] = JSON.parse(body101).data.title;
			gdata["description"] = JSON.parse(body101).data.description;
			gdata["uploader"] = JSON.parse(body101).data.uploader;
			gdata["category"] = JSON.parse(body101).data.category;
			gdata["video_id"] = JSON.parse(body101).data.id;
			gdata["video_url"] = "http://www.youtube.com/watch?v=" + JSON.parse(body101).data.id;
			gdata["thumbnails"] = {
				'small': JSON.parse(body101).data.thumbnail.sqDefault,
				'large': JSON.parse(body101).data.thumbnail.hqDefault
			};
			gdata["duration"] = JSON.parse(body101).data.duration;
			var prettyDurationMin = Math.floor((JSON.parse(body101).data.duration)/60);
			var prettyDurationSeconds = (JSON.parse(body101).data.duration)%60;
			if (prettyDurationSeconds < 10) {
				prettyDurationSeconds = "0" + prettyDurationSeconds.toString();
			}

			gdata["pretty_duration"] = prettyDurationMin.toString() + ":"+ prettyDurationSeconds.toString();
			// gdata["duration"] = JSON.parse(body101).data.items[0].duration;
			gdata["views"] = JSON.parse(body101).data.viewCount;
			gdata["pretty_views"] = numeral(JSON.parse(body101).data.viewCount).format('0,0');
			gdata["rate"] = JSON.parse(body101).data.rating;


			res.set('Content-Type', 'application/json');
			res.send({'data': gdata});

		} else {
			res.set('Content-Type', 'application/json');
			res.send(JSON.stringify({'error': 'Could not find what you were looking for!'}));
		}
		
	});

	

});

app.get('/url/:youtube_url', function (req, res) {
	request('http://gdata.youtube.com/feeds/api/videos/'+ extractParameters(req.param('youtube_url')) +'?v=2&alt=jsonc', function (err, response, body101) {
		if (typeof JSON.parse(body101).data !== 'undefined') {
			var gdata = {};
			gdata["title"] = JSON.parse(body101).data.title;
			gdata["description"] = JSON.parse(body101).data.description;
			gdata["uploader"] = JSON.parse(body101).data.uploader;
			gdata["category"] = JSON.parse(body101).data.category;
			gdata["video_id"] = JSON.parse(body101).data.id;
			gdata["video_url"] = "http://www.youtube.com/watch?v=" + JSON.parse(body101).data.id;
			gdata["thumbnails"] = {
				'small': JSON.parse(body101).data.thumbnail.sqDefault,
				'large': JSON.parse(body101).data.thumbnail.hqDefault
			};
			gdata["duration"] = JSON.parse(body101).data.duration;
			var prettyDurationMin = Math.floor((JSON.parse(body101).data.duration)/60);
			var prettyDurationSeconds = (JSON.parse(body101).data.duration)%60;
			if (prettyDurationSeconds < 10) {
				prettyDurationSeconds = "0" + prettyDurationSeconds.toString();
			}

			gdata["pretty_duration"] = prettyDurationMin.toString() + ":"+ prettyDurationSeconds.toString();
			// gdata["duration"] = JSON.parse(body101).data.items[0].duration;
			gdata["views"] = JSON.parse(body101).data.viewCount;
			gdata["pretty_views"] = numeral(JSON.parse(body101).data.viewCount).format('0,0');
			gdata["rate"] = JSON.parse(body101).data.rating;


			res.set('Content-Type', 'application/json');
			res.send({'data': gdata});

		} else {
			res.set('Content-Type', 'application/json');
			res.send(JSON.stringify({'error': 'Could not find what you were looking for!'}));
		}
		
	});

});



function extractParameters(url) {
    var query = url.match(/.*\?(.*)/)[1];
    var assignments = query.split("&");
    var pair, parameters = {};
    for (var ii = 0; ii < assignments.length; ii++) {
        pair = assignments[ii].split("=");
        parameters[pair[0]] = pair[1];
    }
    return parameters;
}





app.listen(port);


console.log('Listening on port ' + port);
