const { OAuth2Client } = require('google-auth-library');
const http = require('http');
const url = require('url');
const querystring = require('querystring');

const CLIENT_ID = '626391493478-3mg44q3l5ivijc5p72avsg41v8bpkjid.apps.googleusercontent.com';
// const client = new GoogleAuth.OAuth2Client(CLIENT_ID, process.env.CLIENT_SECRET, '');

/**
 * Create a new OAuth2Client, and go through the OAuth2 content
 * workflow.  Return the full client to the callback.
 */
function getAuthenticatedClient() {
  return new Promise((resolve, reject) => {
    // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
    // which should be downloaded from the Google Developers Console.
    const oAuth2Client = new OAuth2Client(
      CLIENT_ID,
      process.env.CLIENT_SECRET, ''
      // keys.web.redirect_uris[0]
    );

    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      scope: [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'email'
      ]
    });

    // Open an http server to accept the oauth callback. In this simple example, the
    // only request to our webserver is to /oauth2callback?code=<code>
    const server = http
      .createServer(async (req, res) => {
        if (req.url.indexOf('/oauth2callback') > -1) {
          // acquire the code from the querystring, and close the web server.
          const qs = querystring.parse(url.parse(req.url).query);
          console.log(`Code is ${qs.code}`);
          res.end('Authentication successful! Please return to the console.');
          server.close();

          // Now that we have the code, use that to acquire tokens.
          const r = await oAuth2Client.getToken(qs.code);
          // Make sure to set the credentials on the OAuth2 client.
          oAuth2Client.setCredentials(r.tokens);
          console.info('Tokens acquired.');
          resolve(oAuth2Client);
        }
      })
      .listen(30000, () => {});
  });
}


async function authenticate(token) {
  try {
    const oAuth2Client = await getAuthenticatedClient();
    // Verify the id_token, and access the claims.
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: oAuth2Client.credentials.id_token,
      audience: keys.web.client_id
    });
    console.log('ticket: ', ticket);
    // You can use this info to get user information too.
    const url = `https://www.googleapis.com/plus/v1/people/me`;
    const res = await oAuth2Client.request({ url });
    console.log(res.data);
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  authenticate: authenticate,
};
