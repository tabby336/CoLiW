var Q, qs, request;

request = require("request");

Q = require("q");

qs = require("querystring");

module.exports = function(cache) {
  return {
    make_request: function(r, method, url, options) {
      var defer, get_options, headers, k, tokens;
      defer = Q.defer();
      if (r.error != null) {
        defer.reject(new Error('Not authenticated for provider \'' + r.provider + '\''));
        return defer.promise;
      }
      tokens = void 0;
      if (r.access_token) {
        tokens = {
          access_token: r.access_token
        };
      } else if (r.oauth_token && r.oauth_token_secret) {
        tokens = {
          oauth_token: r.oauth_token,
          oauth_token_secret: r.oauth_token_secret
        };
      }
      headers = {
        oauthio: {
          k: cache.public_key
        }
      };
      if (tokens.oauth_token && tokens.oauth_token_secret) {
        headers.oauthio.oauthv = '1';
      }
      for (k in tokens) {
        headers.oauthio[k] = tokens[k];
      }
      headers.oauthio = qs.stringify(headers.oauthio);
      url = encodeURIComponent(url);
      if (url[0] !== "/") {
        url = "/" + url;
      }
      url = cache.oauthd_url + "/request/" + r.provider + url;
      get_options = void 0;
      if (method === 'GET') {
        get_options = options;
        options = void 0;
      }
      options = {
        method: method,
        url: url,
        headers: headers,
        form: options,
        qs: get_options
      };
      request(options, function(error, r, body) {
        var response;
        response = void 0;
        if ((body != null) && r.statusCode === 200) {
          if (typeof body === 'string') {
            try {
              response = JSON.parse(body);
            } catch (_error) {

            }
          }
          if (typeof body === 'object') {
            response = body;
          }
          defer.resolve(response);
          return;
        } else {
          defer.reject("An error occured while performing the request");
        }
        if (error) {
          return defer.reject(error);
        }
      });
      return defer.promise;
    },
    make_me_request: function(r, opts) {
      var body, defer, headers, k, options, tokens, url;
      defer = Q.defer();
      if (r.error != null) {
        defer.reject(new Error('Not authenticated for provider \'' + r.provider + '\''));
        return defer.promise;
      }
      tokens = void 0;
      if (r.access_token) {
        tokens = {
          access_token: r.access_token
        };
      } else if (r.oauth_token && r.oauth_token_secret) {
        tokens = {
          oauth_token: r.oauth_token,
          oauth_token_secret: r.oauth_token_secret
        };
      }
      headers = {
        oauthio: {
          k: cache.public_key
        }
      };
      if (tokens.oauth_token && tokens.oauth_token_secret) {
        headers.oauthio.oauthv1 = '1';
      }
      for (k in tokens) {
        headers.oauthio[k] = tokens[k];
      }
      headers.oauthio = qs.stringify(headers.oauthio);
      body = void 0;
      if (opts != null) {
        body = {
          filter: opts.join(',')
        };
      }
      url = r.provider + '/me';
      url = cache.oauthd_url + '/auth/' + url;
      options = {
        method: "GET",
        url: url,
        headers: headers,
        qs: body
      };
      request(options, function(error, r, body) {
        var response;
        response = void 0;
        if ((body != null) && r.statusCode === 200) {
          if (typeof body === 'string') {
            response = JSON.parse(body);
          }
          if (typeof body === 'object') {
            response = body;
          }
          defer.resolve(response.data);
          return;
        } else if (r.statusCode === 501) {
          defer.reject(new Error(body));
        } else {
          defer.reject(new Error("An error occured while retrieving the user's information"));
        }
        if (error) {
          return defer.reject(error);
        }
      });
      return defer.promise;
    }
  };
};
