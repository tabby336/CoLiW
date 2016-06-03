var OAuth = require('oauthio');

OAuth.initialize('PZs45acODMBvV6W7BZGR4Lu_4gM', 'nN_dg-16ggVkuSqc38sg_FBwpMs');


//app.get('/signin', OAuth.auth(provider_name, "http://localhost:3000/oauth/redirect"));
//app.get('/oauth/redirect', oauth.redirect(function))


exports.auth = function(provider, callback) {
	console.log("From oauth module: " + provider);
	console.log("Callback: " + callback);
	OAuth.auth(provider, callback)
}

exports.redirect = function(result, req, res) {
	OAuth.redirect(function(result, req,res) {
		console.log("In redirect");
        if (result instanceof Error) {
            res.status(500).send("error: " + result.message);
            return;
        }

        result.me().done(function(me) {
            console.log(me);
            res.status(200).send(JSON.stringify(me));
            //res.render('command/index');
        });
    });
};
