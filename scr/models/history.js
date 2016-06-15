var data = require('./auth')();

exports.getNthCommand = function(req, res, n) {
	var user_id = req.session.passport.user;
	
	//n = 500;

	var qb = data.ApiHistory.query();
  	qb
    .select('*')
    .from('history')
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