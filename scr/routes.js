var rendering = require('./util/rendering'),
    indexController = require('./controllers/index'),
    loginController = require('./controllers/login'),
    commandController = require('./controllers/command'),
    oauthController = require('./controllers/oauth'),
    oauth = require('oauthio'),
    data = require('./models/auth')();
var validationHandler = require('./controllers/detect_providers');
var cors = require('cors');

var history = require('./models/history.js');


oauth.initialize('PZs45acODMBvV6W7BZGR4Lu_4gM', 'nN_dg-16ggVkuSqc38sg_FBwpMs');

module.exports = function (app, passport) {

    var self = this;
    var provider = 'twitter';
    var cmd = 'twitter caca';

    // Home
    app.get('/', indexController.home);
    app.get('/home', ensureAuthenticated, indexController.userHome);

    app.get('/history', history.getNthCommand)


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
    
    app.get('/twitter', cors(corsOptions), oauth.auth('twitter', "http://localhost:3000/oauth/redirect"));
    app.get('/facebook', cors(corsOptions),  oauth.auth('facebook', "http://localhost:3000/oauth/redirect"));
    app.get('/google_mail', cors(corsOptions),  oauth.auth('google_mail', "http://localhost:3000/oauth/redirect"));
    app.get('/dropbox', cors(corsOptions),  oauth.auth('dropbox', "http://localhost:3000/oauth/redirect"));
    app.get('/youtube', cors(corsOptions),  oauth.auth('youtube', "http://localhost:3000/oauth/redirect"));
    app.get('/google_calendar', cors(corsOptions), oauth.auth('google_calendar', "http://localhost:3000/oauth/redirect"));

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
            //new data.ApiOauth({id: user_id, oauth_session: ses})
            new data.ApiOauth({oauth_session: ses}).where('id', user_id)
            .save(null, {method: 'update'})
            .then(function(model) {
              //  res.redirect("/authProviders?cmd=" + command);  
              //console.log("Tot e bine m-am autentificat " + JSON.stringify(req.session.oauth));
              console.log('Autentificarea a fost facuta');
              //validationHandler.authenticate(req.session.cmd);
              res.redirect('/afterAuthentication');
             // res.status(412).end('');
            }, function(err) {
                console.log("Eroare la redirect " + err);
                //res.redirect("/authProviders?cmd=" + command);  
            });
            //res.redirect("/authProviders?cmd=" + command);
        });
    }));

    //command
    app.post('/authProviders', commandController.authProviders);
    app.get('/authProviders', commandController.authProviders);
    app.get('/command', commandController.commandInterpret);
    app.get('/afterAuthentication', validationHandler.afterAnAuthentication);


    app.get('/successAuth', indexController.successAuth);

    // 'rendering' can be used to format api calls (if you have an api)
    // into either html or json depending on the 'Accept' request header
    app.get('/apitest', function(req, res) {
        rendering.render(req, res, {
            'data': {
                'test': {
                    'testsub': {
                        'str': 'testsub hello world'
                    },
                    'testsub2': 42
                },
                'test2': 'hello world'
            }
        });
    })


    // Auth Middleware
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/');
    }
}

