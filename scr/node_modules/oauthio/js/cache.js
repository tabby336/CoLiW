var cache;

cache = {
  __set: function(obj) {
    var k;
    for (k in obj) {
      this[k] = obj[k];
    }
  }
};

module.exports = cache;
