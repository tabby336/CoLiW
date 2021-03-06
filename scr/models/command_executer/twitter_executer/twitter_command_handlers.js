var Twitter = require('twitter');
var fs = require('fs');
var path = require('path');

var Promise = require('es6-promise').Promise;


exports.help = function() {
    var help = '<div>' + 
                  '<p> <b>Twitter commands:<b> </p> <br>' +

                  '<br>' +

                  '&nbsp; twitter <b>tweet</b> -m "message"<br>' +
                  '&nbsp;&nbsp;&nbsp; -m argument is mandatory. <br>' +

                  '<br>' + 

                  '&nbsp; twitter <b>search</b> -m "message" <br>' +
                  '&nbsp;&nbsp;&nbsp; -n argument is mandatory, returns 15 tweets matching the message. <br>' +

                  '<br>' +

                  '&nbsp; twitter <b>follow</b> <br>' +
                  '&nbsp;&nbsp;&nbsp; -n "username" <br>' +
                  '&nbsp;&nbsp;&nbsp; -i "unique-id" <br>' +
                  '&nbsp;&nbsp;&nbsp; one of -m and -i is mandatory <br>' +

                  '<br>' +

                  '&nbsp; twitter <b>activity</b> <br>' +
                  '&nbsp;&nbsp;&nbsp; -n "username" <br>' +
                  '&nbsp;&nbsp;&nbsp; -i "unique-id" <br>' +
                  '&nbsp;&nbsp;&nbsp; one of -n and -i is mandatory, returns the last 15 tweets of the person. <br>' +

                  '<br><br>' +

               '</div>';
    return help;
    
}


exports.getTweeterClient = function(req){
  var client = new Twitter({
    consumer_key: 'NvWJzavpcdtLIPGPB1TQhMWUM',
    consumer_secret: 'xb61JVsT8jQgzyV8xcPuQEcirzC3OWGXr0b3KMsbu4TPIeDdJP',
    access_token_key: req.session.oauth.twitter.oauth_token,
    access_token_secret: req.session.oauth.twitter.oauth_token_secret
  });
  return client;
}
 
exports.postTweet = function(req, text) {
  return new Promise(function(resolve, reject) {
    var client = new Twitter({
      consumer_key: 'NvWJzavpcdtLIPGPB1TQhMWUM',
      consumer_secret: 'xb61JVsT8jQgzyV8xcPuQEcirzC3OWGXr0b3KMsbu4TPIeDdJP',
      access_token_key: req.session.oauth.twitter.oauth_token,
      access_token_secret: req.session.oauth.twitter.oauth_token_secret
    });
    console.log(text);
    client.post('statuses/update', {status: text}, function(error, tweet, response) {
      if (!error) {
        console.log(tweet);
        resolve(response);
      }
      else {
        console.log(error);
        reject(error);
      }
    });
  });
}

//merge daca o facem cumva asincrona in call
exports.searchTweet = function(req, text) {
  console.log("searchTweet");
  return new Promise(function(resolve, reject) {
    var client = new Twitter({
    consumer_key: 'NvWJzavpcdtLIPGPB1TQhMWUM',
    consumer_secret: 'xb61JVsT8jQgzyV8xcPuQEcirzC3OWGXr0b3KMsbu4TPIeDdJP',
    access_token_key: req.session.oauth.twitter.oauth_token,
    access_token_secret: req.session.oauth.twitter.oauth_token_secret
  });
    client.get('search/tweets', {q: text}, function(error, tweets, response) {
    //console.log(tweets.statuses[1]);
 		if (!error) {
 			resolve(tweets);
 		 }
     else {
      reject(error);
     }

 	  });
  });
}

exports.retweet = function(req, tweetID) {
  return new Promise(function(resolve, reject)  {
    var client = new Twitter({
    consumer_key: 'NvWJzavpcdtLIPGPB1TQhMWUM',
    consumer_secret: 'xb61JVsT8jQgzyV8xcPuQEcirzC3OWGXr0b3KMsbu4TPIeDdJP',
    access_token_key: req.session.oauth.twitter.oauth_token,
    access_token_secret: req.session.oauth.twitter.oauth_token_secret });

    client.post('statuses/retweet', {id: tweetID}, function(error, tweet, response) {
     if (!error) {
      resolve(response);
     }
     else {
      reject(error);
     }
    });
  });
}

exports.follow = function(req, user_id, screen_name) {
  return new Promise(function(resolve, reject)  {
    //console.log(userID);  
    var followUser = {follow: 'true'};
    if (screen_name != undefined) {
        followUser.screen_name = screen_name;
    }
    if (user_id != undefined) {
        followUser.user_id = screen_name;
    }
    var client = new Twitter({
    consumer_key: 'NvWJzavpcdtLIPGPB1TQhMWUM',
    consumer_secret: 'xb61JVsT8jQgzyV8xcPuQEcirzC3OWGXr0b3KMsbu4TPIeDdJP',
    access_token_key: req.session.oauth.twitter.oauth_token,
    access_token_secret: req.session.oauth.twitter.oauth_token_secret });

    client.post('friendships/create', followUser, function(error, tweet, response) {
     if (!error) {
      resolve(response);
     }
     else {
      console.log(error);
      reject(error);
     }
    });
  });
}


exports.getFriends = function(req, screen_name, count) {
  return new Promise(function(resolve, reject)  {
    var client = new Twitter({
    consumer_key: 'NvWJzavpcdtLIPGPB1TQhMWUM',
    consumer_secret: 'xb61JVsT8jQgzyV8xcPuQEcirzC3OWGXr0b3KMsbu4TPIeDdJP',
    access_token_key: req.session.oauth.twitter.oauth_token,
    access_token_secret: req.session.oauth.twitter.oauth_token_secret });

    client.get('friends/ids', {screen_name: screen_name, count: count}, function(error, tweet, response) {
     if (!error) {
      console.log(tweet);
      resolve(tweet);
     }
     else {
      console.log(error);
      reject();
     }
    });
  });
}

exports.getTweets = function(req, screen_name, id) {
  return new Promise(function(resolve, reject)  {
    var obj = {};
    if (screen_name != undefined) {
        obj.screen_name = screen_name;
    }
    if (id != undefined) {
      obj.user_id = id;
    }
    var client = new Twitter({
    consumer_key: 'NvWJzavpcdtLIPGPB1TQhMWUM',
    consumer_secret: 'xb61JVsT8jQgzyV8xcPuQEcirzC3OWGXr0b3KMsbu4TPIeDdJP',
    access_token_key: req.session.oauth.twitter.oauth_token,
    access_token_secret: req.session.oauth.twitter.oauth_token_secret });

    client.get('statuses/user_timeline', obj, function(error, tweet, response) {
     if (!error) {
      //console.log(tweet);
      resolve(tweet);
     }
     else {
      console.log(error);
      reject(error);
     }
    });
  });
}


