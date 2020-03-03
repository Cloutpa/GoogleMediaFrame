
var config = {
  //address for electron to direct to
  address: "127.0.0.1",

  // The port being used
  port: 8080,

  xip : "xip.io",

  // The OAuth client ID from the Google Developers console.
  oAuthClientID : "948771243191-59i5c9tgj9llfc2sqqt0bm7avmpds7e5.apps.googleusercontent.com",

  // The OAuth client secret from the Google Developers console.
  oAuthclientSecret : 'DpQ2Z41owaHGcz-t7kboqrbb',

  // The callback to use for OAuth requests. This is the URL where the app is
  // running. For testing and running it locally, use 127.0.0.1.
  oAuthCallbackUrl : 'http://127.0.0.1:8080/auth/google/callback',

  // The scopes to request. The app requires the photoslibrary.readonly and
  // plus.me scopes.
  scopes : [
   'https://www.googleapis.com/auth/photoslibrary.readonly',
    'profile',
  ],

  // The number of photos to load for search requests.
photosToLoad : 150,


  // The page size to use for search requests. 100 is reccommended.
  searchPageSize : 100,

  // The page size to use for the listing albums request. 50 is reccommended.
  albumPageSize : 50,

  // The API end point to use. Do not change.
  apiEndpoint : 'https://photoslibrary.googleapis.com',

};

if (typeof module !== "undefined") {module.exports = config;}
