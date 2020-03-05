# MRD Auth0 SPA Vue

Vue wrapper for [auth0-spa-js](https://github.com/auth0/auth0-spa-js).
As seen in Auth0's [Vue: Login Tutorial](https://auth0.com/docs/quickstart/spa/vuejs/).

## Usage
1. Make sure an application in the Auth0 dashboard has been created. 
2. Install this package, using `npm install @marketredesign/auth0-spa-vue`.
3. Import the `Auth0Plugin` Vue plugin, and optionally the `authGuard` into your application, using 
`import { Auth0Plugin, authGuard } from "@marketredesign/auth0-spa-vue";`
4. Register the plugin with Vue:
```javascript
Vue.use(Auth0Plugin, {
  domain: 'The Auth0 login domain',
  clientId: 'Auth0 client ID for this application',
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : 'default redirect'
    );
  }
});
```

### Log in to the App
Example template providing a login button:
```vue
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />

    <!-- Check that the SDK client is not currently loading before accessing is methods -->
    <div v-if="!$auth.state.loading">
      <!-- show login when not authenticated -->
      <button v-if="!$auth.state.isAuthenticated" @click="login">Login</button>
      <!-- show logout when authenticated -->
      <button v-if="$auth.state.isAuthenticated" @click="logout">Logout</button>
    </div>
  </div>
</template>
```

Define the login and logout functions for instance as follows.
```javascript
login() {
  this.$auth.loginWithRedirect();
}

logout() {
  this.$auth.logout({
    returnTo: window.location.origin
  });
}
```

### User profile information
Once the user authenticates, the SDK extracts the user's profile information and stores it in memory. 
It can be accessed using `this.$auth.state.user` from inside a Vue component.

### Protecting routes
Routes can be protected by specifying `beforeEnter: authGuard`.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 
See deployment for notes on how to deploy the project to NPM.

### Prerequisites

* NodeJS >= 10

### Installing

1. Clone the repository
2. Execute `npm install`

## Deployment

1. Make sure you are logged into NPM using `npm adduser`
2. Verify the version is correct using `npm version`
3. Publish the package using `npm publish`

## Authors

* **Marijn van der Horst** - *Initial work*

See also the list of [contributors](https://github.com/marketredesign/your_project/contributors) who participated in this project.

## License

This project is licensed under the MRD License - see the [LICENSE](LICENSE) file for details
