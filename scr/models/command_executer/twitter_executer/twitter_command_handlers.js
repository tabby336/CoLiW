var Twitter = require('twitter');
var fs = require('fs');
var path = require('path');

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
      reject();
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
      reject();
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
      reject();
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

exports.getTweets = function(req, screen_name, id, count) {
  return new Promise(function(resolve, reject)  {
    var obj = {count: count};
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
      resolve(tweet);
     }
     else {
      console.log(error);
      reject();
     }
    });
  });
}


