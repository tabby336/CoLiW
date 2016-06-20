var data = require('./auth')();
var toClient = require('../controllers/send_to_client');

exports.getNthCommand = function(req, res) {
	var user_id = req.session.passport.user;
    var n = req.body.number;
    console.log('Sageatuta isi face treaba ' + JSON.stringify(req.body));	

    if (n == 0) {
        toClient.send(req, res, '');
        return;
    }

	var qb = data.ApiHistory.query();
  	qb
    .select('command')
    .where('id', '=', user_id)
    .orderBy('time', 'DESC')
    .limit(n)
    .then(function(result){
        toClient.send(req, res, result[n-1]['command']);
    })
    .catch(function(error) {
        toClient.send(req, res, '');
    });
}

exports.getHistory = function(req, res) {
    var user_id = req.session.passport.user;

    var history = ''

    var qb = data.ApiHistory.query(); 
    qb
    .select('command')
    .where('id', '=',  user_id)
    .orderBy('time', 'DESC')
    .limit(10)
    .then(function(result) {
        console.log(result.length);
        //for(var count = 0; count < result.length; ++count) {
        for(var count = result.length - 1 ; count >= 0; --count ) {
            history = history + '<div><p>' + result[count]['command'] + '</p></div>';
        }
        toClient.send(req, res, history);
    })
    .catch(function(error) {
        toClient.send(req, res, '');
    });

}

exports.getUsername = function(user_id, callback) {
    //var user_id = req.session.passport.user;
    if(typeof user_id !== undefined ) {
        var qb = data.ApiUser.query()
        .select('email')
        .where('id', '=', user_id)
        .then(function(result) {
            var un = result[0]['email'];
            un = un.substr(0, un.indexOf('@'));
            //console.log(un);
            callback(un);
        })
        .catch(function(error) {
            //console.log("guest");
            callback("guest");
        })

    } else {
        //console.log("guest");
        callback("guest");
    }
}