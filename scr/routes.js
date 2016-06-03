
var rendering = require('./util/rendering'),
    indexController = require('./controllers/index'),
    loginController = require('./controllers/login'),
    commandController = require('./controllers/command'),
    oauthController = require('./controllers/oauth'),
    oauth = require('oauthio'),
    data = require('./models/auth')();

    oauth.initialize('PZs45acODMBvV6W7BZGR4Lu_4gM', 'nN_dg-16ggVkuSqc38sg_FBwpMs');

module.exports = function (app, passport) {

    var self = this;
    var provider = 'twitter';
    var cmd = 'twitter caca';

    // Home
    app.get('/', indexController.home);
    app.get('/home', ensureAuthenticated, indexController.userHome);


    // Auth
    app.post('/register', loginController.registerPost);
    app.post('/login', loginController.checkLogin);
    app.get('/logout', loginController.logout);

    //OAuth & friends
    app.get('/twitter', oauth.auth('twitter', "http://localhost:3000/oauth/redirect"));
    app.get('/facebook', oauth.auth('facebook', "http://localhost:3000/oauth/redirect"));
    app.get('/google_mail', oauth.auth('google_mail', "http://localhost:3000/oauth/redirect"));
    app.get('/dropbox', oauth.auth('dropbox', "http://localhost:3000/oauth/redirect"));
    app.get('/youtube', oauth.auth('youtube', "http://localhost:3000/oauth/redirect"));

    app.get('/signin', function(req, res) {
        console.log("Am in /signin endpoint");

        self.provider = req.query.provider;
        self.cmd = req.query.cmd;
        console.log(self.cmd);
        console.log(self.provider);

        if(!req.session.hasOwnProperty('oauth')) {
            console.log("no auth session");
            res.redirect('/' + self.provider);
            console.log("lalalalal");
        } else {
            if(!req.session.oauth.hasOwnProperty(req.query.provider)) {
                console.log("Not logged in with " + req.query.provider);
                res.redirect('/' + self.provider);
            } else {
                console.log("Already logged in with " + req.query.provider);
                res.redirect("/command?cmd=" + req.session.cmd);
            }
        }
    });

    app.get('/oauth/redirect', oauth.redirect(function(result, req, res) {
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
                res.redirect("/authProviders?cmd=" + command);  
            }, function(err) {
                console.log("caca " + err);
                res.redirect("/authProviders?cmd=" + command);  
            });
            //res.redirect("/authProviders?cmd=" + command);
        });
    }));

    //command
    app.post('/authProviders', commandController.authProviders);
    app.get('/authProviders', commandController.authProviders);
    app.get('/command', commandController.commandInterpret);

    
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

