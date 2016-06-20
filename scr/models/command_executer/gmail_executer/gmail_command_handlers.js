var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH =  TOKEN_DIR + 'calendar-nodejs-quickstart.json';

var Promise = require('es6-promise').Promise;

exports.help = function() {
  var help = '<div>' + 
                  '<p> <b>Gmail commands:<b> </p> <br>' +

                  '<br>' +

                  '&nbsp; gmail -t "to" [-s "subject"] [-c "content"] <br>' +
                  '&nbsp;&nbsp;&nbsp; -t target email address <br>' +
                  '&nbsp;&nbsp;&nbsp; -s mail\'s subject <br>' +
                  '&nbsp;&nbsp;&nbsp; -c mail\'s content <br>' +

                  '<br><br>'  +

               '</div>';
  return help;
}


function gmailCredentialsInit(req, res) {
  var clientSecret = 'Pmcs50vSOTF84kDp1M2uXnW1';
  var clientId = '236929257927-4ufgbhet0fb2b5ultlscjt71vvge9fnc.apps.googleusercontent.com';
  var redirectUrl = 'http://localhost:3000/command';
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  var token = {};
  //console.log(req.session);
  token.access_token = req.session.oauth.google_mail.access_token;
  oauth2Client.credentials = token; 
  return oauth2Client;
}

exports.send = function(req, res, email) {
  var gmailClass = google.gmail('v1');
  auth = gmailCredentialsInit(req, res);
  return new Promise(function(resolve, reject) {
    var base64EncodedEmail = new Buffer(email).toString('base64');
    base64EncodedEmail = base64EncodedEmail.replace(/\+/g, '-').replace(/\//g, '_');

    gmailClass.users.messages.send({
      auth: auth,
      userId: 'me',
      resource: {
        raw: base64EncodedEmail
      }
    }, function(response) {
        console.log(response);
        if(response != null) {
          if (response.code!=undefined && parseInt(response.code) == 401) {
            res.status(412).end('google_mail');
            return; 
          } else {
            reject('');    
          }
          reject('');
        }
        else {
          resolve();
        }
    });
  });
}
