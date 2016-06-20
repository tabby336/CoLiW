var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

 var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
  var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
      process.env.USERPROFILE) + '/.credentials/';
  var TOKEN_PATH =  TOKEN_DIR + 'calendar-nodejs-quickstart.json';

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

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
/*exports.listLabels = function(req, res) {
  var gmail = google.gmail('v1');
  auth = gmailCredentialsInit(req, res);
  console.log(req.session.oauth);/
  gmail.users.labels.list({
    auth: auth,
    userId: 'me',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var labels = response.labels;
    if (labels.length == 0) {
      console.log('No labels found.');
    } else {
      console.log('Labels:');
      for (var i = 0; i < labels.length; i++) {
        var label = labels[i];
        console.log('- %s', label.name);
      }
    }
  });
}*/

exports.sendSampleMail = function(req, res) {
  var gmailClass = google.gmail('v1');
  auth = gmailCredentialsInit(req, res);
  var email_lines = [];

  email_lines.push('From: "test" <marta.dianna@gmail.com>');
  email_lines.push('To: ioana.bogdan25@gmail.com');
  email_lines.push('Content-type: text/html;charset=iso-8859-1');
  email_lines.push('MIME-Version: 1.0');
  email_lines.push('Subject: Test Tw email');
  email_lines.push('');
  email_lines.push('And this would be the content.<br/>');
  email_lines.push('The body is in HTML so <b>we could even use bold</b>');

  var email = email_lines.join('\r\n').trim();

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
  });
}