// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var proxy = require('html2canvas-proxy');

    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    
    var ig = require('instagram-node').instagram();
    var config = require('./config.json');
    var Twitter = require('twitter-node-client').Twitter;
    var cors = require('cors')
    var NodeCache = require( "node-cache" );

    // cache tweets for 30 minutes, check cache every .6 seconds
    var tweetsCache = new NodeCache( { stdTTL: 1800000, checkperiod: 600 } );
    // cache images for 7 minutes, check cache ever .6 seconds #420 blaze it
    var imagesCache = new NodeCache( { stdTTL: 420000, checkperiod: 600 } );

    var queries = ['pro_shooters', 'natureonly', 'insta_pick', 'leafpeeping', 'chasingfog', 'soloparking','puddlegram', 'fromwhereIstand']
    var queryList = [];
    // configuration =================
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.json());                                     // parse application/json
    app.use(cors());

    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");
    app.use('/', proxy());
    var totalCache = 0;
    var totalQueries = 0;
    // routes ======================================================================
    // api ---------------------------------------------------------------------

    // for debugging/monitoring purposes
    app.get('/api/data/tweets', function(req, res){
    res.json(tweetsCache.keys());
    }) 
    app.get('/api/data/images', function(req, res){
    res.json(imagesCache.keys());
    }) 

    app.get('/api/images/:page?', function(req, res) {
        totalQueries++;
        var _page = req.query.page;
        console.log("Querying for images on page: " + _page);
        value = imagesCache.get( _page );
        if (value){
            totalCache++;
            console.log("Image page found in cache");
            res.json(value);
            return;
        }

        var imageUrls = {};
        ig.use({client_id: config.instagramkey, client_secret: config.instagramsecret});
        // playing around with mixing up the tags for variety
        if(!queryList || queryList.length === 0){
            queryList = queries.slice();
            queryList = shuffle(queryList);

        }
        var query = queryList.pop();
        console.log("searching for photos on " + query);
        ig.tag_media_recent(query, function(err, medias, pagination, remaining, limit) {
             if(err) { 
                throw new Error(err); 
            }
             for(photo in medias){
                imageUrls[photo] = medias[photo].images.standard_resolution.url;
             }
            var response = new Object();
            response.images = imageUrls;
            success = imagesCache.set( _page, response, 10000 );
            console.log("sending photos");
            res.json(response);
        });
    });
  app.get('/api/data', function(req, res){
    var data = {}
    data.tweets = tweetsCache.getStats();
    data.images = imagesCache.getStats();
    data.caching = "Total Queries In Cache " + totalCache + " Total Queries  " + totalQueries;
    res.send(data);
  }) 
function checkTweetCache(_id, _page, res){
  var response = new Object();
  value = tweetsCache.get( _id );
    if ( value ){
        totalCache++;
        console.log("Tweet found in cache");
        var newTweets = {};
        var tweetCount = 0;
        var page = _page * 5
        for(tweet in value.tweets){
            if (tweetCount > page && tweetCount <=parseInt((page) + 5)){
                newTweets[tweet] = value.tweets[tweet];
            }
            if(tweetCount > parseInt((page) + 5)) break;
            tweetCount++;
        }
        response.tweets = newTweets;
        response.length = Object.keys(newTweets).length
        console.log("Sending tweets");
        res.json(response);
        return true;
    }  
}
  app.get('/api/tweets/:user/:page', function(req, res) {
    var tweets = {};
    var _id  = req.params.user;
    var _page  = req.params.page;
    var response = new Object();

    console.log("Username : " + _id + " page : " + _page);
    totalQueries++;
    if(checkTweetCache(_id, _page, res)) return;
    //Get this data from your twitter apps dashboard
    var conf = {
        "consumerKey": config.twitterkey,
        "consumerSecret": config.twittersecret,
    };

    var twitter = new Twitter(conf);
    //pull in 100 tweets excluding rts and replies
    var error = function (err, response, body) {
        res.status(404).send('Not found');
    };

    var success = function (data) {
        // make response pretty
        data = JSON.parse(data);
        var count = 0;
        for(tweet in data){
            // ignore tweets with a URL in it
            kLINK_DETECTION_REGEX = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi;
            data[tweet].text = data[tweet].text.replace(kLINK_DETECTION_REGEX, '');
                // map text -> count (weight can be used later to pull good tweets)
            tweets[tweet] = data[tweet].text;
            count++;
            if(count >= 4) break;
        }
        response.tweets = tweets;
        res.json(response);

        success = tweetsCache.set( _id, response, 10000 );
        twitter.getUserTimeline({ screen_name: _id, count: '200',
            exclude_replies: true, include_rts: false}, error, successPage2);
        
    };
     var successPage2 = function (data) {
        console.log("Got page 2 of tweets");
        data = JSON.parse(data);
        for(tweet in data){
            if(data[tweet].text.indexOf("http") == -1){
                tweets[tweet] = data[tweet].text;
            } 
        }
            response.tweets = tweets;
            success = tweetsCache.set( _id, response, 10000 );  
    };

    console.log("searching for tweets");
    twitter.getUserTimeline({ screen_name: _id, count: '20',
    exclude_replies: true, include_rts: false}, error, success);
});
function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

   