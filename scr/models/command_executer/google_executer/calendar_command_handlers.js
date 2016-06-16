var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

 var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
  var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
      process.env.USERPROFILE) + '/.credentials/';
  var TOKEN_PATH =  TOKEN_DIR + 'calendar-nodejs-quickstart.json';

function calendarCredentialsInit(req, res) {
  var clientSecret = 'Pmcs50vSOTF84kDp1M2uXnW1';
  var clientId = '236929257927-4ufgbhet0fb2b5ultlscjt71vvge9fnc.apps.googleusercontent.com';
  var redirectUrl = 'http://localhost:3000/command';
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  var token = {};
  console.log(req.session);
  token.access_token = req.session.oauth.google_calendar.access_token;
  oauth2Client.credentials = token; 
  return oauth2Client;
}

exports.listEvents = function(req, res, date, count) {
  var auth  = calendarCredentialsInit(req, res);
  return new Promise(function(resolve, reject) {
    var calendar = google.calendar('v3');
    var auth = calendarCredentialsInit(req, res);
    var date = date != undefined ? new Date(date) : new Date();
    calendar.events.list({
      auth: auth,
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime'
    }, function(err, response) {
      if (err) {
        reject(err);
      }
      resolve(response);
    });
  });
} 
