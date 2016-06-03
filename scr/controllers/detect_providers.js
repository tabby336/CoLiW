
exports.getInvalidProvider = function (cmd) {
  var providers = ["twitter", "facebook", "google_mail", "flickr", "dropbox"];
  var providersRequired = [];

  newCmd = ('|' + cmd).replace();

  for (i = 0; i < providers.length; i++) {
    if (cmd.indexOf(providers[i]) > -1) {
      providersRequired.push(providers[i]);
    }
  }
  return providersRequired;
};