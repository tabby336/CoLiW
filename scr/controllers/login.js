var crypto = require('crypto'),
    passport = require('passport'),
    data = require('../models/auth')();


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
    passport.authenticate('local', function(err, user, info) {
        if (err || !user) {
            req.flash('username', req.body.un);
            req.flash('error', info.message);
            req.session.command_output = "Username or password invalid :(";
            return res.redirect('/');
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.redirect('/');
            }
            un = req.body.un;
            req.session.username = un.substr(0, un.indexOf('@'));
            req.flash('success', 'Welcome!');
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
                req.session.command_output = "Login succesfully!!";
                return res.redirect('/');
            }, function(err) {
                console.log(err);
            });
        });
    })(req, res, next);
}


exports.logout = function(req, res) {
    req.logout();
    req.flash('info', 'You are now logged out.');
    req.session.command_output = 'Logged out succesfully! Come back soon!';
    console.log("Logged out!!")
    delete req.session['oauth'];
    res.redirect('/');
}
