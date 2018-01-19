
function useGoogleIdTokenForAuth(token) {
  // Call the backend with the token through an HTTP POST request
}

window.onGoogleYoloLoad = (googleyolo) => {
  console.log(`The 'googleyolo' object is ready for use.`);

  const signinConfiguration = {
    supportedAuthMethods: [ // List of providers
      'https://accounts.google.com', // To retrieve google account credentials
      'googleyolo://id-and-password', // To fallback to password based when not google account is saved
    ],
    supportedIdTokenProviders: [{ // ID tokens will be used to securely identify the user with the app's backend
      uri: 'https://accounts.google.com',
      // This the app ID created on the Google Console
      clientId: '626391493478-3mg44q3l5ivijc5p72avsg41v8bpkjid.apps.googleusercontent.com',
    }]
  };

  googleyolo.retrieve(signinConfiguration).then(credential => {
    console.log('retrieve was successfull', credential);
    useGoogleIdTokenForAuth(credential.idToken);
  }).catch(error => {
    console.warn(error.message)
    if (error.type === 'noCredentialsAvailable') {
      googleyolo.hint(signinConfiguration).then(credential => {
        console.log('hint was successfull', credential);
      }).catch((error) => {
        switch (error.type) {
          case "userCanceled":
            // The user closed the hint selector. Depending on the desired UX,
            // request manual sign up or do nothing.
            break;
          case "noCredentialsAvailable":
            // No hint available for the session. Depending on the desired UX,
            // request manual sign up or do nothing.
            break;
          case "requestFailed":
            // The request failed, most likely because of a timeout.
            // You can retry another time if necessary.
            break;
          case "operationCanceled":
            // The operation was programmatically canceled, do nothing.
            break;
          case "illegalConcurrentRequest":
            // Another operation is pending, this one was aborted.
            break;
          case "initializationError":
            // Failed to initialize. Refer to error.message for debugging.
            break;
          case "configurationError":
            // Configuration error. Refer to error.message for debugging.
            break;
          default:
            // Unknown error, do nothing.
        }
      });
    }
  });
};
