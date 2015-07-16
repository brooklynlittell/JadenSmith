/**
Calls the flickr/twitter apis for 100 responses
Flicker api returns url of image
Twitter url returns tweet/popularity
Note: insta/twitter api functions are asynch, and should use callbacks
if need to make sure function has completed
**/

var express = require('express');
var app = express();
var Twitter = require('twitter-node-client').Twitter;
var config = require('./config.json');
var ig = require('instagram-node').instagram();
var cors = require('cors')

app.use(cors());
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



// todo pull these out to a model
var imageUrls = {};
var tweets = {};

//Get this data from your twitter apps dashboard
var conf = {
    "consumerKey": config.twitterkey,
    "consumerSecret": config.twittersecret,
};

var twitter = new Twitter(conf);
//pull in 100 tweets excluding rts and replies
var username = 'officialjaden'
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
        app.get('/tweets', function(request, response) {
            var res = new Object();
            res.tweets = tweets;
            response.send(res);
        });
    }
};
twitter.getUserTimeline({ screen_name: username, count: '100',
    exclude_replies: true, include_rts: false}, error, success);
//getting images
ig.use({client_id: config.instagramkey, client_secret: config.instagramsecret});
ig.tag_media_recent('nature', function(err, medias, pagination, remaining, limit) {
     if(err) { throw new Error(err); }
     for(photo in medias){
        imageUrls[photo] = medias[photo].images.standard_resolution.url;
     }
     app.get('/images', function(request, response) {
        var res = new Object();
        res.images = imageUrls;
        response.send(res);
    });
});



