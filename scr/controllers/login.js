var crypto = require('crypto'),
    passport = require('passport'),
    data = require('../models/auth')();
var toClient = require('./send_to_client');
var outputFormat = require('./format_output');


exports.registerPost = function(req, res) {
    var vpw = req.body.vpw;
    var pwu = req.body.pw;
    var un = req.body.un;
    
    req.flash('username', un);
    
    if(vpw !== pwu) {      
        toClient.send(req, res, outputFormat.errorMessage('Your passwords did not match.'));
        return;
    }

    req.checkBody('un', 'Please enter a valid email.').notEmpty().isEmail();
    var errors = req.validationErrors();
    if (errors) {
        var msg = errors[0].msg;
        toClient.send(req, res, outputFormat.errorMessage('An error has occurred.' + msg));
        return;
    }
    
    var new_salt = Math.round((new Date().valueOf() * Math.random())) + '';
    var pw = crypto.createHmac('sha1', new_salt).update(pwu).digest('hex');
    var created = new Date().toISOString().slice(0, 19).replace('T', ' ');

    //insert database
    new data.ApiUser({email: un, password: pw, salt: new_salt, created: created}).save().then(function(model) {
        passport.authenticate('local')(req, res, function () {
            toClient.send(req, res, outputFormat.okMessage('Your account has been created. Please login!'));
            return;
        })
    }, function(err) {
        console.log('Unable to create account');
        console.log(err);
        toClient.send(req, res, outputFormat.errorMessage('Unable to create account. Most likely the username already exists.'));
        return;
    });
}

exports.checkLogin = function(req, res, next) {

    //if(req.isAuthenticated()) {
    //    toClient.send(req, res, "Must logout first!");
    //    return;
    //}

    console.log('Username: ' + req.body.un);
    console.log('Password: ' + req.body.pw);
    passport.authenticate('local', function(err, user, info) {
        if (err || !user) {
            req.flash('username', req.body.un);
            req.flash('error', info.message);
            toClient.send(req, res, outputFormat.errorMessage('Username or password invalid.'));
            req.logout();
            return;
        }
        req.logIn(user, function(err) {
            if (err) {
               toClient.send(req, res, outputFormat.errorMessage('An error has occurred.'));
               return;
            }
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
                toClient.send(req, res, outputFormat.okMessage('Login succesfully.'));  
                req.logout();
            }, function(err) {
                console.log(err);
            });
        });
    })(req, res, next);
}


exports.logout = function(req, res) {
    console.log("Logged out!!")
    console.log(req.session);
    if(req.session.passport.user > 0) {
        delete req.session['oauth'];   
        req.logout();
        toClient.send(req, res, outputFormat.okMessage('Logout succesfully.')); 
    } else {
        toClient.send(req, res, outputFormat.okMessage('You are not logged in anyway.'));
        
    }
}
