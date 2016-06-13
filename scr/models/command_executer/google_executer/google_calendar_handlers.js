var gcal = require('google-calendar');

exports.getGoogleEvents = function(req, res) {
  
    console.log("am in google calendar");
    //console.log(req.session.oauth);

    var accessToken = req.session.oauth.google_calendar.access_token;

    
    var googleUserId = 'ioana.bogdan25@gmail.com';

    /*
    gcal(accessToken).calendarList.list(function(err, data) {
      if(err) { 
        //return res.send(500,err); 
        console.log(err);
      } else {
        console.log(data);
      }
      //return res.send(data);
    });
    */

    
    var google_calendar = new gcal.GoogleCalendar(accessToken);

    google_calendar.events.list(googleUserId, {'timeMin': new Date().toISOString()}, function(err, eventList){
      if(err){
        //response.send(500, err);
        console.log(err);
      }
      else{
        //response.writeHead(200, {"Content-Type": "application/json"});
        //response.write(JSON.stringify(eventList, null, '\t'));
        //response.end();
        console.log(JSON.stringify(eventList,null, '\t'));
      }
    });
    
    
  
  };