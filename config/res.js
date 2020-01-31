'use strict';

exports.ok = function(message, values, res) {
  var data = {
      'status': 200,
      'message': message,
      'data': values
  };
  res.status(200).json(data);
  res.end();
};

exports.bad = function(message, values, res) {
    var data = {
        'status': 403,
        'message': message,
        'data': values
    };
    res.status(200).json(data);
    res.end();
  };