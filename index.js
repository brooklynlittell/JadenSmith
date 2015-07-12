var express = require('express');
var app = express();
var Twitter = require('twitter-node-client').Twitter;


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('Hello World! poop');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

 //Callback functions
    var error = function (err, response, body) {
        console.log('ERROR [%s]', err);

    };
    var success = function (data) {
    	var tweets = {};
    	// make response pretty
        data = JSON.parse(data);
        for(tweet in data){
        	// ignore tweets with a URL in it
        	if(data[tweet].text.indexOf("http") == -1){
        		// map text -> count (weight can be used later to pull good tweets)
        		tweets[data[tweet].text] = data[tweet].retweet_count + data[tweet].favorite_count;
        	} 
        }
        console.log(tweets)
        // returns the map of the tweets for a given user
        return tweets;        
    };


    //Get this data from your twitter apps dashboard
    var config = {
        "consumerKey": "k1pfjLFmJkT2WKt5IEeOMTpXR",
        "consumerSecret": "yyEn9IsMQKXnbP8RFWBRAaIz04NaOz6LKnsp5anp6GIPj1PUrA",
    }

    var twitter = new Twitter(config);

    //pull in 100 tweets excluding rts and replies
    var username = 'officialjaden'
    var tweets = twitter.getUserTimeline({ screen_name: username, count: '100',
    	exclude_replies: true, include_rts: false}, error, success);
	
   


