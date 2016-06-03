var qs;

qs = require('querystring');

module.exports = function(csrf_generator, cache, authentication) {
  return function(app) {
    app.get('/oauth/csrf_token', (function(_this) {
      return function(req, res) {
        var csrf_token;
        csrf_token = csrf_generator(req);
        return res.send(200, csrf_token);
      };
    })(this));
    return app.get('/oauth/redirect', (function(_this) {
      return function(req, res) {
        console.log('uh?', req.query, req.session);
        return authentication.authenticate((JSON.parse(req.query.oauthio)).data.code, req.session).then(function(r) {
          return cache.redirect_cb(r, req, res);
        }).fail(function(e) {
          return cache.redirect_cb(e, req, res);
        });
      };
    })(this));
  };
};
