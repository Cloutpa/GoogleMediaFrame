// Google Auth
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
  var GoogleAuth;
  var SCOPE = 'profile https://www.googleapis.com/auth/photoslibrary.readonly';
  var clientID = '325108795912-kqqpq12nh4n1utvi9omta42kf4gqknpo.apps.googleusercontent.com';

  function handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient);
  }
  function initClient() {
    // Retrieve the discovery document for version 3 of Google Drive API.
    // In practice, your app can retrieve one or more discovery documents.
    var discoveryUrl = 'https://content.googleapis.com/discovery/v1/apis/photoslibrary/v1/rest';
    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    gapi.client.init({
        'apiKey': 'AIzaSyCiEDJkUe2z2GpA4o2BcqQgQHeGCYqqlgM',
        'clientId': '325108795912-kqqpq12nh4n1utvi9omta42kf4gqknpo.apps.googleusercontent.com',
        'discoveryDocs': [discoveryUrl],
        'scope': SCOPE
    }).then(function () {
      GoogleAuth = gapi.auth2.getAuthInstance();

      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus);

      // Handle initial sign-in state. (Determine if user is already signed in.)
      var user = GoogleAuth.currentUser.get();
      setSigninStatus();




      // Call handleAuthClick function when user clicks on
      //      "Sign In/Authorize" button.
      $('#sign-in-or-out-button').click(function() {
        handleAuthClick();
      });

      $('#revoke-access-button').click(function() {
        revokeAccess();




      });
    });
  }

  function handleAuthClick() {
    if (GoogleAuth.isSignedIn.get()) {
      // User is authorized and has clicked "Sign out" button.
      revokeAccess();
      location.reload();



    } else {
      // User is not signed in. Start Google auth flow.

      GoogleAuth.signIn();



    }
  }

  function revokeAccess() {

    GoogleAuth.disconnect();
    myFunction();


  }

  function setSigninStatus(isSignedIn) {


    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);


    if (isAuthorized) {

      // If the user is signed in -- do this

      $('#sign-in-or-out-button').html('Sign out');
      $('#revoke-access-button').css('display', 'inline-block');
      $('#auth-status').html('You are currently signed in and have granted ' +
          'access to this app.');

          listAlbums();
          myFunction();


//if not signed in
    } else {
      $('#sign-in-or-out-button').html('Sign In');
      $('#revoke-access-button').css('display', 'none');
      $('#auth-status').html('You have not authorized this app or you are ' +
          'signed out.');
    }
  }

  function updateSigninStatus(isSignedIn) {
    setSigninStatus();
    // myFunction();
  }












  function listAlbums() {
      return gapi.client.photoslibrary.albums.list({})
          .then(function(response) {
                  // Handle the results here (response.result has the parsed body).
                  console.log("Handling Responce", response.result.albums);
//need a loop to go through each album link, and place it into an array to hold all album links

//To hold all of the album coverPhotos
var albumArray = [];


//store the album covers from json to the albumArray for future use
for (i = 0; i < response.result.albums.length; i++){
  console.log("album", i , "cover image", response.result.albums[i].coverPhotoBaseUrl);
  albumArray[i] = response.result.albums[i].coverPhotoBaseUrl;
}
//

//Takes the images from the albumArray and print them.
for(x = 0; x < albumArray.length; x += 2){
var newImg = document.createElement("imgLink");
newImg.innerHTML = '<div class="row"><div class="column"><img src = ' + albumArray[x] + '></img></div><div class="column"><img src = ' + albumArray[x+1] + '></img></div></div>';
var currentDiv = document.getElementById("albums");
currentDiv.insertBefore(newImg, currentDiv.childNodes[0]);
}
                },
                function(err) { console.error("Execute error", err); });
                gapi.load("client:auth2", function() {
                  gapi.auth2.init({client_id: clientID});
                });
    }

//     function myFunction(){
//
//       if(GoogleAuth.isSignedIn.get()){
//         document.getElementById("signedIn").style.display = "block";
//       }
//       else if (GoogleAuth.isSignedIn.get() == false) {
//         document.getElementById("signedIn").style.display = "none";
//       }
// }
