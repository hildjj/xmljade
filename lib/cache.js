// Generated by CoffeeScript 1.10.0
(function() {
  var bb, cache, fs;

  bb = require('bluebird');

  fs = bb.promisifyAll(require('fs'));

  cache = {};

  this.read = function(filename, xform) {
    var last;
    if (filename == null) {
      return bb.resolve(null);
    }
    last = cache[filename];
    if (last != null) {
      return bb.resolve(last);
    }
    return fs.readFileAsync(filename).then(function(last) {
      if (xform != null) {
        return xform(last);
      } else {
        return last;
      }
    }).then(function(last) {
      return cache[filename] = last;
    });
  };

  this.readSync = function(filename, xform) {
    var last;
    if (filename == null) {
      throw new Error('filename required');
    }
    last = cache[filename];
    if (last != null) {
      return last;
    }
    last = fs.readFileSync(filename);
    return cache[filename] = xform != null ? xform(last) : last;
  };

  this.clear = function() {
    return cache = {};
  };

}).call(this);

//# sourceMappingURL=cache.js.map
