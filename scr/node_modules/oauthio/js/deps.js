var deps;

deps = {
  __set: function(obj) {
    var k;
    for (k in obj) {
      deps.container[k] = obj[k];
    }
  },
  reset: {},
  container: {}
};

module.exports = deps;
