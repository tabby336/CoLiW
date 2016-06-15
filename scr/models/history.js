var data = require('./auth')();

exports.getNthCommand = function(req, res, n) {
	var user_id = req.session.passport.user;
	
	//n = 5;

	var qb = data.ApiHistory.query();
  	qb
    .select('command')
    .where('id', '=', user_id)
    .orderBy('time', 'DESC')
    .limit(n)
    .then(function(result){
        //return ??
        //count starts from 0
       	console.log(result[n-1]['command']);
    })
    .catch(function(error) {
        //return ??
        console.log("no command");
    });
}

exports.getUsername = function(req, res) {
    var user_id = req.session.passport.user;
    if(typeof user_id !== undefined ) {
        var qb = data.ApiUser.query()
        .select('email')
        .where('id', '=', user_id)
        .then(function(result) {
            var un = result[0]['email'];
            un = un.substr(0, un.indexOf('@'));
            console.log(un);
        })
        .catch(function(error) {
            console.log("guest");
        })

    } else {
        console.log("guest");
    }
}