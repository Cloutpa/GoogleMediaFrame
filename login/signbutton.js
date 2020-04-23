// Google Auth
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
  var GoogleAuth;
  var SCOPE = 'profile https://www.googleapis.com/auth/photoslibrary.readonly';
  var clientID = '325108795912-kqqpq12nh4n1utvi9omta42kf4gqknpo.apps.googleusercontent.com';


  //To hold all of the album details

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

    } else {
      // User is not signed in. Start Google auth flow.

      GoogleAuth.signIn();

    }
  }

  function revokeAccess() {
    GoogleAuth.disconnect();
    window.location.assign("http://weblab.salemstate.edu/~S0311569/src/index.html");
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


          if(window.location.pathname == "/~S0311569/src/index.html"){
            getAlbums();
            displayArrays();

          }

          if(window.location.pathname == "/~S0311569/src/setup.html"){

          //need a way so that when the user clicks on an image -- the variable will pass the albumId
          //albumId is currently stored in albumIdArray[];
        getPassingTitle();
          getPassingAlbum();

          getPhotosInAlbums(passingAlbum);
          }



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
  }


  let albumCoverArray = [];
  let albumTitleArray = [];
  let albumIdArray = [];

  let mediaItemsIdArray = [];
  let mediaItemsBaseArray = [];

  let passingAlbum = "-1";

function getAlbums(){
  return gapi.client.photoslibrary.albums.list({})
      .then(function(response) {
              // Handle the results here (response.result has the parsed body).
              //console.log("Handling Responce", response.result.albums);
            saveResponce(response);
            //displayArrays();
            displayAlbums();
            },
            function(err) { console.error("Execute error", err); });
}

function saveResponce(response){
  //store the album covers from json to the albumArray for future use
  for (i = 0; i < response.result.albums.length; i++){
    albumCoverArray[i] = response.result.albums[i].coverPhotoBaseUrl;
    albumTitleArray[i] = response.result.albums[i].title;
    albumIdArray[i] = response.result.albums[i].id;

  }

}



function displayArrays(){
for (i = 0; i < albumCoverArray.length; i++){
console.log(albumCoverArray[i]);
console.log(albumTitleArray[i]);
console.log(albumIdArray[i]);
}


}
function displayAlbums(){
  //Takes the images and titles from the albumArray and print them.
  for(x = 0; x < albumCoverArray.length; x += 2){
  var newImg = document.createElement("imgLink");
  let y = x+1;
  newImg.innerHTML = '<div class="row"><div class="column"><h3 onclick="displayAlbumsPassingFunction('+ x +');">' + albumTitleArray[x] + '</h3><img src = ' + albumCoverArray[x] + '></img></div><div class="column"><h3 onclick="displayAlbumsPassingFunction('+ y +');">' + albumTitleArray[y] +   '</h3><img src = ' + albumCoverArray[y] + '></img></div></div>';


  // newImg.innerHTML = '<div class="row"><div class="column"><h3>' + albumTitleArray[x] + '</h3><a href="./setup.html"><img src = ' + albumCoverArray[x] + '></img></div><div class="column"><h3>' + albumTitleArray[x+1] +   '</h3><a href="./setup.html"><img src = ' + albumCoverArray[x+1] + '></img></div></div>';
  var currentDiv = document.getElementById("albums");
  currentDiv.insertBefore(newImg, currentDiv.childNodes[0]);
  }


}

//need to set the album id of the element that was clicked,
//then need to change pages
function displayAlbumsPassingFunction(count){

passingAlbum = albumIdArray[count];
localStorage.setItem("passingAlbum", passingAlbum);

passingTitle = albumTitleArray[count];
localStorage.setItem("passingTitle", passingTitle);

window.location.href = "http://weblab.salemstate.edu/~S0311569/src/setup.html";

}



function getPassingAlbum(){
passingAlbum = localStorage.getItem("passingAlbum");
console.log(passingAlbum);

}

function getPassingTitle(){

  document.getElementById("passingTitleFun").innerHTML = localStorage.getItem("passingTitle");

}



function getPhotosInAlbums(albumId){
// album id == "AKM1yC5YCWgov2aYuZ38cYMtHNi-Ji9QN4RJlmT9MUD0wZE6F9AbTHjfLpNO5LTfpOBszsLdQ0g0"
  //albumId = "AKM1yC5YCWgov2aYuZ38cYMtHNi-Ji9QN4RJlmT9MUD0wZE6F9AbTHjfLpNO5LTfpOBszsLdQ0g0";
  return gapi.client.photoslibrary.mediaItems.search({
    "resource": {
      "albumId": albumId
    }
  })
      .then(function(response) {
              // Handle the results here (response.result has the parsed body).
              console.log("Response", response.result.mediaItems);

              //store the album covers from json to the albumArray for future use
              for (i = 0; i < response.result.mediaItems.length; i++){
                mediaItemsIdArray[i] = response.result.mediaItems[i].id;
                mediaItemsBaseArray[i] = response.result.mediaItems[i].baseUrl;

                console.log(mediaItemsIdArray[i]);
                console.log(mediaItemsBaseArray[i]);

}



                for(x = 0; x < response.result.mediaItems.length; x += 2){
                  var newImg = document.createElement("imgLink");


                  newImg.innerHTML = '<div class="row"><div class="column"><a data-fancybox="gallery" href = ' + mediaItemsBaseArray[x] + '><img  src = ' + mediaItemsBaseArray[x] + '></img></a></div><div class="column"><a data-fancybox="gallery" href = ' + mediaItemsBaseArray[x+1] + '><img  src = ' + mediaItemsBaseArray[x+1] + '></img></div></div>';

                  // working version
                  //newImg.innerHTML = '<div class="row"><div class="column"><img src = ' + mediaItemsBaseArray[x] + '></img></div><div class="column"><img src = ' + mediaItemsBaseArray[x+1] + '></img></div></div>';

                  var currentDiv = document.getElementById("photosInAlbum");
                  currentDiv.insertBefore(newImg, currentDiv.childNodes[0]);
                    }

            },
            function(err) { console.error("Execute error", err); });
}
