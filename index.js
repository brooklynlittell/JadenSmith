/**
Calls the flickr/twitter apis for 100 responses
Flicker api returns url of image
Twitter url returns tweet/popularity
Note: flickr/twitter api functions are asynch, and should use callbacks
if need to make sure function has completed
**/

var express = require('express');
var app = express();
var Twitter = require('twitter-node-client').Twitter;
var Flickr = require("flickrapi");

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
// array of urls for nature images from 0-99
var imageUrls = [];
//map of tweets->popularity
var tweets = {};
 //Callback functions
    var error = function (err, response, body) {
        console.log('ERROR [%s]', err);
    };
    var success = function (data) {
        // make response pretty
        data = JSON.parse(data);
        for(tweet in data){
            // ignore tweets with a URL in it
            if(data[tweet].text.indexOf("http") == -1){
                // map text -> count (weight can be used later to pull good tweets)
                tweets[data[tweet].text] = data[tweet].retweet_count + data[tweet].favorite_count;
            } 
        }
        console.log(tweets);
    };

    var flickrOptions = {
      api_key: "d2e3db77d30f0c33b2b1f174f70833d1",
      secret: "30850763566d311f"
    };

    Flickr.tokenOnly(flickrOptions, function(error, flickr) {
        var imageUrls = [];
        flickr.photos.search({
            text: "nature", page: 1}, function(err, result) {
            if(err) { throw new Error(err); }
            // do something with result
            for (count in result.photos.photo){
                photo = result.photos.photo[count];
                var url = "https://farm" + photo.farm + ".staticflickr.com/" +
                photo.server + "/"+ photo.id + "_" + photo.secret + ".jpg";
                imageUrls[count] = url;
                }
            console.log(imageUrls);s
            });
    });

    //Get this data from your twitter apps dashboard
    var config = {
        "consumerKey": "k1pfjLFmJkT2WKt5IEeOMTpXR",
        "consumerSecret": "yyEn9IsMQKXnbP8RFWBRAaIz04NaOz6LKnsp5anp6GIPj1PUrA",
    };
    var twitter = new Twitter(config);
    //pull in 100 tweets excluding rts and replies
    var username = 'officialjaden'
    twitter.getUserTimeline({ screen_name: username, count: '100',
        exclude_replies: true, include_rts: false}, error, success);

