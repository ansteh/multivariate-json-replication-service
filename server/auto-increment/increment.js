'use strict';
const _ = require('lodash');

const Increment = (options) => {
  let pool = new Map([]);

  _.forEach(options, (option) => {
    pool.set(option.path, option);
  });

  let incrementJSON = (json) => {
    pool.forEach(option => {
      _.set(json, option.path, option.value);
      option.value += 1;
    });
    return json;
  };

  let increment = (json) => {
    if(_.isArray(json)) {
      return _.map(json, incrementJSON);
    }
    return incrementJSON(json);
  };

  return {
    increment: increment
  };
};

module.exports = Increment;
