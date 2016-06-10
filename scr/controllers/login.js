var crypto = require('crypto'),
    passport = require('passport'),
    data = require('../models/auth')();
var toClient = ('./send_to_client');


exports.registerPost = function(req, res) {
    var vpw = req.body.vpw;
    var pwu = req.body.pw;
    var un = req.body.un;
    
    req.flash('username', un);
    
    if(vpw !== pwu) {
        req.flash('error', 'Your passwords did not match.');
        res.redirect('/');
        return;
    }

    req.checkBody('un', 'Please enter a valid email.').notEmpty().isEmail();
    var errors = req.validationErrors();
    if (errors) {
        var msg = errors[0].msg;
        req.flash('error', msg);
        res.redirect('/');
        return;
    }
    
    var new_salt = Math.round((new Date().valueOf() * Math.random())) + '';
    var pw = crypto.createHmac('sha1', new_salt).update(pwu).digest('hex');
    var created = new Date().toISOString().slice(0, 19).replace('T', ' ');

    //insert database
    new data.ApiUser({email: un, password: pw, salt: new_salt, created: created}).save().then(function(model) {
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        })
    }, function(err) {
        req.flash('error', 'Unable to create account.');
        console.log('Unable to create account');
        res.redirect('/');
    });
}

exports.checkLogin = function(req, res, next) {
    console.log('Username: ' + req.body.un);
    console.log('Password: ' + req.body.pw);
    passport.authenticate('local', function(err, user, info) {
        if (err || !user) {
            req.flash('username', req.body.un);
            req.flash('error', info.message);
            //toClient.send(req, res, '<p>Username or password invalid </p>');
            res.writeHead(200, {"Content-Type": "text/plain"});      
            res.end('<p>Username or password invalid </p>');  
            req.logout();
        }
        req.logIn(user, function(err) {
            if (err) {
                //return res.redirect('/');
                res.writeHead(200, {"Content-Type": "text/plain"});      
                res.end('<p>An error has occurred!</p>');  
            }
            un = req.body.un;
            req.session.username = un.substr(0, un.indexOf('@'));
            delete req.session['oauth'];
            new data.ApiOauth({id: req.session.passport.user})
            .fetch()
            .then(function(model) {
                if(model === null) {
                    console.log('No tokens.');
                } else {
                    oauth_session = model.get('oauth_session');
                    console.log(oauth_session.length);
                    if(oauth_session.length > 1) {
                        req.session.oauth = JSON.parse(oauth_session);
                    }
                }
                console.log('login succesfully');
                res.writeHead(200, {"Content-Type": "text/plain"});      
                res.end('<p>Login succesfully!</p>');  
                req.logout();
            }, function(err) {
                console.log(err);
            });
        });
    })(req, res, next);
}


exports.logout = function(req, res) {
    console.log("Logged out!!")
    delete req.session['oauth'];
    res.writeHead(200, {"Content-Type": "text/plain"});      
    res.end('<p>Logout succesfully!</p>');  
    req.logout();
}
