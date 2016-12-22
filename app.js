'use strict';

const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const _              = require('lodash');
const cors           = require('cors');
const Onehot         = require('./server/onehot.js');

app.use(cors());
app.use(bodyParser.json());

let config = require('./config.default.json');
try {
  let appConfig = require('./config.json');
  let hosts = _.concat(config.hosts, appConfig.hosts);
  _.assign(config, appConfig, { hosts: hosts });
} catch(err) {}

const isValidHost = (host) => {
  let name = _.first(_.split(host, ':'));
  return _.includes(config.hosts, name);
};

const approveRequest = (func) => {
  return (req, res) => {
    if(isValidHost(req.get('host'))) {
      func(req, res);
    } else {
      res.status(401);
    }
  };
};

app.get('/', approveRequest((req, res) => {
  res.status(200).json({ valid: true });
}));

const sample = (data, size) => {
  size = size || 10;
  return got.post(config.mv_url, {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
    	"size": size,
      "data": data
    })
  })
  .then(res => {
    return res.body;
  });
};

app.post('/replicate', approveRequest((req, res) => {
  Onehot.encode('json', req.body)
    .then(encoded => sample(encoded))
    .then(samples => Onehot.decode('json', samples))
    .then(output => res.json(output))
    .catch(err => res.json(err));
}));

const server = require('http').Server(app);
let port = config.port;

server.listen(port, function(){
  console.log(`listening on *:${port}`);
});
