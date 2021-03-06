var rendering = require('./util/rendering'),
    indexController = require('./controllers/index'),
    loginController = require('./controllers/login'),
    commandController = require('./controllers/command'),
    data = require('./models/auth')(),
    validationHandler = require('./controllers/detect_providers'),
    cors = require('cors');
    history = require('./models/history.js');

var oauthModule = require('./controllers/oauth');
var oauth = oauthModule.oauth;

module.exports = function (app, passport) {

    var self = this;
    
    // Home
    app.get('/', indexController.home);

    // History 
    app.post('/history', history.getNthCommand);


    // Auth
    app.post('/register', loginController.registerPost);
    app.post('/login', loginController.checkLogin);
    app.get('/logout', loginController.logout);

    //OAuth & friends
    var whitelist = ['https://oauth.io', 'https://api.twitter.com'];
    var corsOptions = {
      origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
      }
    };
    
    // Production
    app.get('/twitter', cors(corsOptions), oauth.auth('twitter', "http://54.149.64.177:3000/oauth/redirect"));
    app.get('/facebook', cors(corsOptions),  oauth.auth('facebook', "http://54.149.64.177:3000/oauth/redirect"));
    app.get('/google_mail', cors(corsOptions),  oauth.auth('google_mail', "http://54.149.64.177:3000/oauth/redirect"));
    app.get('/dropbox', cors(corsOptions),  oauth.auth('dropbox', "http://54.149.64.177:3000/oauth/redirect"));
    app.get('/youtube', cors(corsOptions),  oauth.auth('youtube', "http://54.149.64.177:3000/oauth/redirect"));
    app.get('/google_calendar', cors(corsOptions), oauth.auth('google_calendar', "http://54.149.64.177:3000/oauth/redirect"));
    

    /*
    // Local testing
    app.get('/twitter', cors(corsOptions), oauth.auth('twitter', "http://localhost:3000/oauth/redirect"));
    app.get('/facebook', cors(corsOptions),  oauth.auth('facebook', "http://localhost:3000/oauth/redirect"));
    app.get('/google_mail', cors(corsOptions),  oauth.auth('google_mail', "http://localhost:3000/oauth/redirect"));
    app.get('/dropbox', cors(corsOptions),  oauth.auth('dropbox', "http://localhost:3000/oauth/redirect"));
    app.get('/youtube', cors(corsOptions),  oauth.auth('youtube', "http://localhost:3000/oauth/redirect"));
    app.get('/google_calendar', cors(corsOptions), oauth.auth('google_calendar', "http://localhost:3000/oauth/redirect"));
    */
    

    app.get('/oauth/redirect', oauth.redirect(function(result, req, res) {
        console.log("In oauth redirect");
        console.log("Req: "  + req.session.cmd);
        var command = req.session.cmd;
        if (result instanceof Error) {
            res.send(500, "error: " + result.message);
            return;
        }
        result.me().done(function(me) {
            var user_id = req.session.passport.user;
            var ses = JSON.stringify(req.session.oauth);
            new data.ApiOauth({oauth_session: ses}).where('id', user_id)
            .save(null, {method: 'update'})
            .then(function(model) {
              console.log('Autentificarea a fost facuta');
              res.redirect('/afterAuthentication');
            }, function(err) {
                console.log("Eroare la redirect " + err);
            });
        });
    }));

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
     res.status(err.status || 500);
     res.render('error', {
     message: err.message,
     error: {}
    });
    });

    //command
    app.post('/authProviders', commandController.authProviders);
    app.get('/authProviders', commandController.authProviders);
    app.get('/command', commandController.commandInterpret);
    app.get('/afterAuthentication', validationHandler.afterAnAuthentication);
    app.get('/successAuth', indexController.successAuth);

    // Auth Middleware
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/');
    }
}