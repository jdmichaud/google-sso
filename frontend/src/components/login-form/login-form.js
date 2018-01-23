// const loginFormTemplate = require('./login-form.html');

class LoginForm extends HTMLElement {
  constructor() {
    super();
  }

  // connectedCallback() {
  //   this.innerHTML = loginFormTemplate;
  // }
}

customElements.define('login-form', LoginForm);
