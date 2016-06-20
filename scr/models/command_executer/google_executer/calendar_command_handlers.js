var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var util = require('../../../controllers/utils_validation');

var Promise = require('es6-promise').Promise;

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
  //console.log(req.session);
  token.access_token = req.session.oauth.google_calendar.access_token;
  oauth2Client.credentials = token; 
  return oauth2Client;
}

exports.help = function() {
  var help = '<div>' + 
                  '<p> <b>Calendar commands:<b> </p> <br>' +

                  '<br>' +

                  '&nbsp; calendar <b>events</b> [-d "date"] [-c "# of events"] <br>' +
                  '&nbsp;&nbsp;&nbsp; -d date in format "dd mm yyyy" <br>' +
                  '&nbsp;&nbsp;&nbsp; -c the number of events you want to see <br>' +
                  '&nbsp;&nbsp;&nbsp; Both parameters can be used' +

                  '<br>' +

                  '&nbsp; calendar <b>insert</b> -d "date" | -p "period" [-s "subject"] [-l "location"] <br>' +
                  '&nbsp;&nbsp;&nbsp; -d date in format "dd mm yyyy" <br>' +
                  '&nbsp;&nbsp;&nbsp; -p the period in the format "<it>from - to</it>" <br>' + 
                  '&nbsp;&nbsp;&nbsp;&nbsp; where <it>from</it> and <it>to</it> are of form "dd mm yyyy hh mm" <br>' +
                  '&nbsp;&nbsp;&nbsp; -s the subject of the event. <br>' +
                  '&nbsp;&nbsp;&nbsp; -l the location of the event. <br>' +
                  '&nbsp;&nbsp;&nbsp; One of -d or -p arguments is mandatory. <br>' +

                  '<br><br>'  +

              '</div>';
  return help;
}

exports.listEvents = function(req, res, date, count) {
  var auth  = calendarCredentialsInit(req, res);
  return new Promise(function(resolve, reject) {
    var calendar = google.calendar('v3');
    var dateFormated = date != undefined ? util.getDateValid(date) : new Date();
    calendar.events.list({
      auth: auth,
      calendarId: 'primary',
      timeMin: dateFormated.toISOString(),
      maxResults: count,
      singleEvents: true,
      orderBy: 'startTime'
    }, function(err, response) {
          if (err != undefined ) {
              if (parseInt(err.code) == 401) {
                res.status(412).end('google_calendar');
                return; 
              } else {
                reject(err);    
              }
          }
          resolve(response);
      });
  });
} 

exports.insert = function(req, res, event) {
  var auth = calendarCredentialsInit(req, res);
  return new Promise(function(resolve, reject) {
    var calendar = google.calendar('v3');
    calendar.events.insert(
      {
        auth: auth,
        calendarId: 'primary',
        resource: event
      }, function(err, response) {
          if (err != undefined ) {
              if (parseInt(err.code) == 401) {
                res.status(412).end('google_calendar');
                return; 
              } else {
                reject(err);    
              }
          }
          resolve(response);
        });
  });
}
