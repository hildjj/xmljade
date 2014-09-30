(function() {
  var fix, fs, jade, pkg, slg, transform, xml;

  fs = require('fs');

  xml = require('libxmljs');

  jade = require('jade');

  slg = require('slug');

  pkg = require('../package');

  fix = function(r) {
    switch (r.type()) {
      case 'attribute':
        return r.value();
      case 'text':
        return r.text();
      default:
        return r;
    }
  };

  this.transform = transform = function(xmldata, jadedata, options) {
    var fn, xmldoc;
    if (options == null) {
      options = {
        pretty: true
      };
    }
    xmldoc = xml.parseXmlString(xmldata);
    fn = jade.compile(jadedata, options);
    return fn({
      $: function(q, c) {
        if (c == null) {
          c = xmldoc;
        }
        return fix(c.get(q));
      },
      $$: function(q, c) {
        var r, _i, _len, _ref, _results;
        if (c == null) {
          c = xmldoc;
        }
        _ref = c.find(q);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          r = _ref[_i];
          _results.push(fix(r));
        }
        return _results;
      },
      $att: function(e, a) {
        var _ref;
        return e != null ? (_ref = e.attr(a)) != null ? _ref.value() : void 0 : void 0;
      },
      slug: function(s) {
        if (s != null) {
          return slg(s).toLowerCase();
        } else {
          return null;
        }
      },
      version: "" + pkg.name + " v" + pkg.version
    });
  };

  this.transformFile = function(jade, xml, options, cb) {
    if (options == null) {
      options = {
        pretty: true
      };
    }
    if (cb == null) {
      cb = function() {};
    }
    return fs.readFile(xml, function(err, xmldata) {
      if (err != null) {
        return cb(err);
      }
      return fs.readFile(jade, function(err, jadedata) {
        if (err != null) {
          return cb(err);
        }
        options.filename = jade;
        return cb(null, transform(xmldata, jadedata, options));
      });
    });
  };

  this.cmd = function(args) {
    var opts, program;
    program = require('commander');
    program.version(pkg.version).usage('[options] <template> <input>').option('-d, --debug', 'Add Jade debug information').option('-o, --output [file]', 'Output file').option('-p, --pretty', 'Pretty print').parse(args);
    if (program.args.length < 2) {
      program.help();
    }
    opts = {
      pretty: program.pretty,
      compileDebug: program.debug
    };
    return this.transformFile(program.args[0], program.args[1], opts, function(er, output) {
      if (er != null) {
        return console.error(er);
      }
      if (program.output != null) {
        return fs.writeFile(program.output, output, function(er) {
          if (er != null) {
            return console.error(er);
          }
        });
      } else {
        return console.log(output);
      }
    });
  };

}).call(this);