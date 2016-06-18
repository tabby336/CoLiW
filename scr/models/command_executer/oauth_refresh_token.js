var data = require('../auth')(),
    oauthModule = require('../../controllers/oauth');

var oauth = oauthModule.oauth;


exports.refreshTokens = function(req, provider, callback) {

	oauth.auth(provider, req.session, {
    	force_refresh: true
	});


    console.log(req.session.oauth.google_calendar);

	console.log(req.session.oauth[provider].refreshed);
	if(req.session.oauth[provider].refreshed == true) {
		// Also update credentials in the DB
		var user_id = req.session.passport.user;
        var ses = JSON.stringify(req.session.oauth);
            
        new data.ApiOauth({oauth_session: ses}).where('id', user_id)
        .save(null, {method: 'update'})
        .then(function(model) {
        	//
        }, function(err) {
             console.log('Database update problem: ' + err);
        });
	} 
    callback('');
}
