const GoogleAuth = require('google-auth-library');

const CLIENT_ID = '626391493478-3mg44q3l5ivijc5p72avsg41v8bpkjid.apps.googleusercontent.com'

const client = new GoogleAuth.OAuth2Client(CLIENT_ID, '', '');

function authenticate(token) {
  console.log('token', token.slice(0, 30));
  return client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
}

module.exports = {
  authenticate: authenticate,
};
