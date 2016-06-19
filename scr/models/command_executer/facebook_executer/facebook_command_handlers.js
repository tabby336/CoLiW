// Using require() in ES5
var FB = require('fb');
var fs  = require('fs');
var request = require('request');

var Promise = require('es6-promise').Promise;

exports.facebookFeedPostMessage = function(req, text, url) {
  return new Promise(function(resolve, reject) {
    var obj = {};
    if (text != undefined) {
      obj.message = text;
    }
    if (url !=  undefined) {
      obj.link = url;
    }
    
   	FB.setAccessToken(req.session.oauth.facebook.access_token);	
  	FB.api('/me/feed', 'post', obj, function (res) {
      console.log('\n\n\n\n' + JSON.stringify(res));
    		if(!res || res.error) {
      		console.log(!res ? 'error occurred' : res.error);
          reject(res);
      		return;
    		}
    		console.log('Post Id: ' + res.id);
        resolve(res);
  	});
  });
}

exports.facebookFriends = function(req) {
  FB.setAccessToken(req.session.oauth.facebook.access_token); 
  FB.api(
    "/me/friends",
    function (response) {
      if (response && !response.error) {
        /* handle the result */
        console.log(response.data);
        return response;
      }
    });
}

exports.facebookFeedPostPhoto = function(req, url, text) {
  return new Promise(function(resolve, reject) {
  	FB.setAccessToken(req.session.oauth.facebook.access_token);		
    var obj = {}

  	FB.api('/me/photos', 'post', { url: url, caption: text }, function (res) {
  		if(!res || res.error) {
      	console.log(!res ? 'error occurred' : res.error);
      	reject(res);
    	}
      else {
        resolve(res);
  	    console.log('Post Id: ' + res.post_id);
      }
    });
  });
}

exports.facebookPostPhotoFromLocal = function (req, message, path) {
   return new Promise(function(resolve, reject) { 
  authToken = req.session.oauth.facebook.access_token;
  console.log("FACEBOOK POST PHOTO   " + path);
  request.post(
    {
        url: 'https://graph.facebook.com/me/photos?access_token=' + authToken, 
        formData: {
            message: '',
            source: fs.createReadStream(path)
        }
    }, function(err, res, body) {
        var bodyJSON = JSON.parse(body);
        if(bodyJSON.error) {
            console.log(bodyJSON.error.message);
            reject(err);
        }
        else {
          console.log("FACEBOOK POST PHOTO");
          resolve(res);
        }
    }
  );
});
}
