// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var proxy = require('html2canvas-proxy');
    var path = require('path');

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
    app.use('/api/proxy', proxy());
    var totalCache = 0;
    var totalQueries = 0;
    var lastTweet;
    // routes ======================================================================
    
    /**
 * Development Settings
 */
if (app.get('env') === 'development') {
    // This will change in production since we'll be using the dist folder
    app.use(express.static(path.join(__dirname, '../client')));
    // This covers serving up the index page
    app.use(express.static(path.join(__dirname, '../client/.tmp')));
    app.use(express.static(path.join(__dirname, '../client/app')));

    // Error Handling
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

/**
 * Production Settings
 */
if (app.get('env') === 'production') {

    // changes it to use the optimized version for production
    app.use(express.static(path.join(__dirname, '/dist')));

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}
    
    
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
                res.status(404).send('Error ' + err);
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
    if ( value && value[_page]){
        totalCache++;
        console.log("Tweet found in cache");
        response[_page] = value[_page]
        res.json(response);
        return true;
    }  
    else{
        return false;
    }
}
  app.get('/api/tweets/:user', function(req, res) {
    var _id  = req.params.user;
    if(tweetsCache.get( _id )){
        res.json(tweetsCache.get( _id ));
    }
    else{
        res.status(404).send("Error " + err);
    }
  });
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
        res.status(404).send('Error ' + err);
    };

    var success = function (data) {
        // make response pretty
        data = JSON.parse(data);
        for(tweet in data){
            // deals with overlapping tweets between pages
            if(_page > 0  && parseInt(tweet) === 0){
                continue;
            }
            // ignore tweets with a URL in it
            kLINK_DETECTION_REGEX = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi;
            data[tweet].text = data[tweet].text.replace(kLINK_DETECTION_REGEX, '');
                // map text -> count (weight can be used later to pull good tweets)
            if(data[tweet].text.length === 0 ) continue;
            if(parseInt(tweet) === data.length - 1) {
                break;
            }
            tweets[tweet] = data[tweet].text;
                response.lastTweet = data[tweet].id;
        }
        tweets = Object.keys(tweets).map(function(key){return tweets[key]})
        response[_page] = tweets;
        oldResponse = tweetsCache.get(_id);
        if(oldResponse && !oldResponse[_page]){
            oldResponse[_page] = response[_page];
            oldResponse.lastTweet = response.lastTweet;
        }
        else{
            oldResponse = response;
        }
        res.json(response);
        success = tweetsCache.set( _id, oldResponse, 10000 );
    };

    console.log("searching for tweets");
    if (tweetsCache.get(_id)){
        twitter.getUserTimeline({ screen_name: _id, count: 20, max_id: tweetsCache.get(_id).lastTweet,
        exclude_replies: true, include_rts: false}, error, success);        
    }
    else{
        twitter.getUserTimeline({ screen_name: _id, count: 20, 
        exclude_replies: true, include_rts: false}, error, success);        
    }
});
function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

module.exports = app;
