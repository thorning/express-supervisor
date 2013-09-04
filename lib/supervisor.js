// Copyright Calendize Ltd

var _ = require('underscore');

exports.middleware = function (opts) {
  return function (req, res, next) {
    var version;
    // Header Strategy
    version = req.headers[opts.header_name.toLowerCase()];

    //Default Strategy
    if (!version && opts.default_version) {
      version = opts.default_version;
    }

    // More Strategies?

    req.supervisor = {};
    req.supervisor.version = version;
    next();
  };
};

exports.select = function (api) {
  var api_keys = _.keys(api).reverse();
  return function (req, res, next) {
    var version = req.supervisor.version || _.first(api_keys);
    for (var i in api_keys) {
      var key = api_keys[i], fn;
      if (key <= version) {
        fn = api[key];
      }
      if (fn) {
        fn(req, res, next);
        return;
      }
    }
    res.send(403, 'no api for ' + version + ' found');
  };
};
