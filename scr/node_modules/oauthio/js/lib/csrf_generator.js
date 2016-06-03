module.exports = function(guid) {
  return function(session) {
    var csrf_token;
    csrf_token = guid();
    session.csrf_tokens = session.csrf_tokens || [];
    session.csrf_tokens.push(csrf_token);
    if (session.csrf_tokens.length > 4) {
      session.csrf_tokens.shift();
    }
    return csrf_token;
  };
};
