exports.middleware = function (opts) {
  return function (req, res, next) {
    var version;
    // Header Strategy
    version = req.headers[opts.header_name];

    // More Strategies?

    req.supervisor = {};
    req.supervisor.version = version;
  };
};

exports.select = function (api) {
  return function (req, res, next) {
    var version = req.supervisor.version;
    for (var i = version; i > -1; i--) {
      var fn = api[i];
      if (fn) {
        fn(req, res, next);
        break;
      }
    }
    console.log('no api for', version, 'found');
  };
};
