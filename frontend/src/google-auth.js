'use strict';

// This is the API key to be used for interaction with Google aith services.
// You can retrieve it in Google Console. It is unique for every "application".
const CLIENT_ID = '626391493478-3mg44q3l5ivijc5p72avsg41v8bpkjid.apps.googleusercontent.com'

/**
 * This function activate Google Yolo mecanism. A popup will appear and you can
 * either select your account if multiple accounts are available of it will
 * automaticaly log you with the only account saved by the browser.
 * If no credentials are stored in the browser, the `hint` function will fail
 * and return 'noCredentialsAvailable'.
 */
export function startGoogleYolo(googleyolo) {
  return new Promise(function (resolve, reject) {
    // Configuration object to be used with the google library
    const signinConfiguration = {
      supportedAuthMethods: [ // List of providers
        'https://accounts.google.com', // To retrieve google account credentials
        'googleyolo://id-and-password', // To fallback to password based when not google account is saved
      ],
      supportedIdTokenProviders: [{ // ID tokens will be used to securely identify the user with the app's backend
        uri: 'https://accounts.google.com',
        // This the app ID created on the Google Console
        clientId: CLIENT_ID,
      }]
    };
    // Retrieve the authentication of the currently logged in user in the browser
    googleyolo.retrieve(signinConfiguration).then(credential => {
      console.log('retrieve was successfull', credential);
      resolve(credential);
    }).catch(error => {
      // No users are logged in, request the user to log to a registered account
      // on this browser
      console.warn(error.message)
      if (error.type === 'noCredentialsAvailable') {
        googleyolo.hint(signinConfiguration).then(credential => {
          console.log('hint was successfull', credential);
          resolve(credential);
        }).catch((error) => {
          reject(error);
        });
      }
    });
  });
};
