var oauthRefreshTokens = require('../oauth_refresh_token');
var toClient = require('../../../controllers/send_to_client');

exports.googleCommand = function(req, res) {
	//return new Promise(function(reject,))
	oauthRefreshTokens.refreshTokens(req, 'google_calendar');
	toClient.send(req, res, "lalalaaa google command");
}
