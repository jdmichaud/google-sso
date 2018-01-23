require('@webcomponents/custom-elements/custom-elements.min');
require('bootstrap/dist/css/bootstrap.min.css');
// TODO: require('font-awesome/css/font-awesome.css');

import { startGoogleYolo } from 'google-auth';
import { LoginForm } from 'components/login-form/login-form';

// Start the authentication process once the google library is loaded
window.onGoogleYoloLoad = (googleyolo) => {
  window.googleyolo = googleyolo;
}

// Send token to the backend for login
function useGoogleIdTokenForAuth(credential) {
  // Call the backend with the token through an HTTP POST request
  const request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200)
      console.log('token is verified');
  }
  request.open('POST', `http://${window.location.hostname}:8000/auth`, true); // true for asynchronous
  request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  request.send(JSON.stringify(credential));
}

// Called when google login button pressed
window.googleLogin = function () {
  startGoogleYolo(window.googleyolo).then((credential) => {
    useGoogleIdTokenForAuth(credential);
  }).catch((error) => {
    console.log(`error: ${error}`);
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
  })
}

// Called by the custom login form
window.customLogin = function () {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  console.log(`logging in with ${email} ${password}`);
}
