// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyA8GLSt5-OR-NS2D--48mF7op22u7V0lz0',
    authDomain: 'myhovecraft.firebaseapp.com',
    databaseURL: 'https://myhovecraft.firebaseio.com',
    projectId: 'myhovecraft',
    storageBucket: 'myhovecraft.appspot.com',
    messagingSenderId: '420885254001'
  }
};
