
const CLIENT_ID = '626391493478-3mg44q3l5ivijc5p72avsg41v8bpkjid.apps.googleusercontent.com'

function useGoogleIdTokenForAuth(credential) {
  // Call the backend with the token through an HTTP POST request
  const request = new XMLHttpRequest();
  // request.onreadystatechange = function() {
  //   if (request.readyState == 4 && request.status == 200)
  //     callback(request.responseText);
  // }
  request.open('POST', `http://${window.location.hostname}:8000/auth`, true); // true for asynchronous
  request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  request.send(JSON.stringify(credential));
}

window.startGoogleYolo = function (googleyolo) {
  console.log(`The 'googleyolo' object is ready for use.`);

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
    useGoogleIdTokenForAuth(credential);
  }).catch(error => {
    // No users are logged in, request the user to log to a registered account
    // on this browser
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

// Start the authentication process once the google library is loaded
window.onGoogleYoloLoad = (googleyolo) => {
  window.googleyolo = googleyolo;
}

