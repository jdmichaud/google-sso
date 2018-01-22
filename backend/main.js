const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const auth = require('./auth.js');

// Create the Express application
const app = express();
app.disable('x-powered-by');
// Logging
app.use(morgan('combined'));
//
app.use(bodyParser.json());
// For CORS (TODO: Add an option)
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  //intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
    //respond with 200
    res.sendStatus(200);
  } else { next(); }
});
// The auth api to be called by the client to authenticate credentials on the
// server
app.post(`/auth/?`, (req, res) => {
  console.log(req.body);
  if (req.body.idToken === undefined || req.body.displayName === undefined) {
    res.status(400).send({ error: `Bad Request. Missing idToken or displayName` });
    return;
  }
  auth.authenticate(req.body.idToken).then(() => {
    console.log('token verified');
    res.sendStatus(200);
  }).catch(() => {
    console.log('token failed to verify');
    res.status(403).send({ error: `failed to verify ${req.body.displayName} identify` });
  });
});
// These options should be retrieve from a config file or passed as parameters
const options = {
  port: 8000,
  host: 'localhost',
  prefix: '',
};
// Start the web server
app.listen(options.port, options.host, () => {
  let prompt = 'server listening on';
  prompt += ` http://${options.host}:${options.port}/${options.prefix}`;
  console.log(prompt);
});
