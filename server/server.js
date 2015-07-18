// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express

    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    
    var ig = require('instagram-node').instagram();
    var config = require('./config.json');
    var Twitter = require('twitter-node-client').Twitter;
    var cors = require('cors')
    var NodeCache = require( "node-cache" );

    // cache tweets for 30 minutes, check cache every .6 seconds
    var tweetsCache = new NodeCache( { stdTTL: 1800000, checkperiod: 600 } );
    // cache images for 15 minutes, check cache ever .6 seconds
    var imagesCache = new NodeCache( { stdTTL: 900000, checkperiod: 600 } );


    // configuration =================
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.json());                                     // parse application/json
    app.use(cors());

    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");

    var totalCache = 0;
    var totalQueries = 0;
// routes ======================================================================

    // api ---------------------------------------------------------------------
    // get all todos
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
        var queries = ['pro_shooters', 'natureonly', 'insta_pick']
        var rand = queries[Math.floor(Math.random() * queries.length)];
        console.log("searching for photos");
        ig.tag_media_recent(rand, function(err, medias, pagination, remaining, limit) {
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
  app.get('/api/tweets/:user?', function(req, res) {
    var tweets = {};
    var _id  = req.query.user;
    console.log(req.route);
    console.log(req.query.user);
    totalQueries++;
    value = tweetsCache.get( _id );
    if ( value ){
        totalCache++;
        console.log("Tweet found in cache");
        res.json(value);
        return;
    }
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
        for(tweet in data){
            // ignore tweets with a URL in it
            if(data[tweet].text.indexOf("http") == -1){
                // map text -> count (weight can be used later to pull good tweets)
                tweets[tweet] = data[tweet].text;

            } 
        }
            var response = new Object();
            response.tweets = tweets;
            success = tweetsCache.set( _id, response, 10000 );
            console.log("sending tweets");
            res.json(response);
        
    };
    console.log("searching for tweets");
    twitter.getUserTimeline({ screen_name: _id, count: '100',
    exclude_replies: true, include_rts: false}, error, success);
});

   