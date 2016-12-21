'use strict';
const Increment = require('./increment.js');
const increments = new Map([]);

const create = (id, options, json) => {
  return new Promise((resolve, reject) => {
    try {
      if(options && increments.has(id) === false) {
        increments.set(id, Increment(options));
      }
      resolve(json);
    } catch(err) {
      reject(err);
    }
  });
};

const encode = (id, options, json) => {
  return new Promise((resolve, reject) => {
    try {
      let instance;
      if(increments.has(id)) {
        instance = increments.get(id);
      } else {
        instance = Increment(options);
      }
      let encoded = instance.increment(json);
      increments.set(id, instance);
      resolve(encoded);
    } catch(err) {
      reject(err);
    }
  });
};

module.exports = {
  encode: encode,
  create: create
};
