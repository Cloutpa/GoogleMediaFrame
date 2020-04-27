//LOGIN FILE


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
    window.location.assign("http://weblab.salemstate.edu/~S0311569/login/login.html");
  }


  function setSigninStatus(isSignedIn) {


    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);

    if (isAuthorized) {
      // If the user is signed in -- change button to sign out
      $('#sign-in-or-out-button').html('Sign out');
     // loadClient();
     $('#userName').html(user.getBasicProfile().getName());
      checkLocation();




//if not signed in
    } else {
      $('#sign-in-or-out-button').html('Sign In');

    }
  }


  function updateSigninStatus(isSignedIn) {
    setSigninStatus();
  }

  function loadClient() {
    gapi.client.setApiKey("AIzaSyCiEDJkUe2z2GpA4o2BcqQgQHeGCYqqlgM");
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/photoslibrary/v1/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }



//Check where the user is located, and run respected scripts based on location
        function checkLocation(){
          //bring the user to main webpage
          if(window.location.pathname == "/~S0311569/login/login.html"){
        window.location.assign("http://weblab.salemstate.edu/~S0311569/login/home.html");
          }

          else if(window.location.pathname == "/~S0311569/login/home.html"){
          console.log("Home");
          loadClient();

          }

          else if(window.location.pathname == "/~S0311569/login/album.html"){
          console.log("Albums");
          loadClient();
          getAlbums();
          getToggleState();


          //getAlbumDisplayIDArray();
          // checkAlbumDisplayID();


          }

          else if(window.location.pathname == "/~S0311569/login/photos.html"){
          console.log("Photos");
          loadClient();
          getPhotos();


          }

          else if(window.location.pathname == "/~S0311569/login/albumContent.html"){
          console.log("AlbumContent");
          loadClient();
          getPassingAlbum();
          getPhotosInAlbums(passingAlbum);
          }



          else if(window.location.pathname == "/~S0311569/login/photosContent.html"){
          console.log("Photos Content");
          loadClient();
          getPassingPhotoPage();
          getPhotosFromPage();
          }

          else if(window.location.pathname == "/~S0311569/login/display.html"){
            console.log("Display");
            loadClient();
            getAlbumDisplayIDArray();
            getAllAlbumPhotos();
          }


        }




        let userName;
    //array to hold all photo id user wants to display
    let AlbumDisplayID = [];
    //array to hold all photoBaseID user wants to display
    let DisplayBaseArray = [];


    //Used to hold album cover photo links
    let albumCoverArray = [];
    //Used to hold album titles
    let albumTitleArray = [];
    //Used to hold album ID's
    let albumIdArray = [];
    //hold the amount of photos in an album
    let albumMediaItemsCount = [];
    //Used to hold media items id
    let mediaItemsIdArray = [];
    //Used to hold media items photo link
    let mediaItemsBaseArray = [];
    //temp used to pass albumID for next page
    let passingAlbum = "-1";
    //temp used to pass next media items page
    let mediaNextPage = "-1";
    let numberPhotos = 25;
    let nextPageToken;
    let stateVar = [];




//!!! Functions used for album pages !!!!
//Get Albums from a signed in account.
    function getAlbums(){
      gapi.load("client:auth2", function() {
        gapi.auth2.init({client_id: "325108795912-kqqpq12nh4n1utvi9omta42kf4gqknpo.apps.googleusercontent.com"});
      });
      return gapi.client.photoslibrary.albums.list({})
          .then(function(response) {
                  // Handle the results here (response.result has the parsed body).
                  console.log("Response", response.result);
                  saveAlbumResponce(response);
                  displayAlbums();
                  checkingStateVar();


                },
                function(err) { console.error("Execute error", err); });
    }



//save the response of google album call.
    function saveAlbumResponce(response){
      //store the album covers from json to the albumArray for future use
      for (i = 0; i < response.result.albums.length; i++){
        albumCoverArray[i] = response.result.albums[i].coverPhotoBaseUrl;
        albumTitleArray[i] = response.result.albums[i].title;
        albumIdArray[i] = response.result.albums[i].id;
        albumMediaItemsCount[i] = response.result.albums[i].mediaItemsCount;

      if(AlbumDisplayID.indexOf(response.result.albums[i].id)){
        console.log("already in AlbumDisplayID");

        //if in here, then user previously selected the album..
        //need to get the state of each albumtoggle

      }

      }

    }


//Display data saved from album response
    function displayAlbumData(){
    for (i = 0; i < albumCoverArray.length; i++){
    console.log(albumCoverArray[i]);
    console.log(albumTitleArray[i]);
    console.log(albumIdArray[i]);
    console.log(albumMediaItemsCount[i]);

        }
      }


//display users albums to theDiv element.

      function displayAlbums(){
//Takes the images and titles from the albumArray and print them.
  for(x = 0; x < albumCoverArray.length; x++){
  var theDiv = document.getElementById("theDiv");
  theDiv.innerHTML += '<div class="col-md-4"><div class="card mb-4 box-shadow"><a data-fancybox="gallery" href = ' + albumCoverArray[x] + '><img class="card-img-top" src='+ albumCoverArray[x] +' alt="Google Image"></img></a><div class="card-body"><p class="card-text">Title: ' + albumTitleArray[x] + '</p><p class="card-text">Number of Photos: ' + albumMediaItemsCount[x] + '</p><div class="d-flex justify-content-between align-items-center"><div class="btn-group"><button type="button" class="btn btn-sm btn-outline-secondary" onclick="passingAlbumPhotos('+ x +');">View</button> <button class="btn btn-sm btn-outline-secondary"> <div class="pretty p-default p-round p-fill"> <input type="checkbox" id="myCheckbox('+x+')" onclick="checkToggle('+x+')"/><div class="state"><label>Display</label></button></div></div></div></div> </div></div>';
        }
}


// When user clicks view in album page, pass the value of which album is clicked, and pass the album id to the next page
//this is to recieve album photos on another page
      function passingAlbumPhotos(count){
        console.log(count);
        passingAlbum = albumIdArray[count];
        localStorage.setItem("passingAlbum", passingAlbum);
        passingTitle = albumTitleArray[count];
        localStorage.setItem("passingTitle", passingTitle);
        window.location.href = "http://weblab.salemstate.edu/~S0311569/login/albumContent.html";
      }

//get the album id and title from previous page
      function getPassingAlbum(){
      passingAlbum = localStorage.getItem("passingAlbum");
      passingTitle = localStorage.getItem("passingTitle");

      console.log(passingAlbum);
      console.log(passingTitle);
      document.getElementById("passingTitle").innerHTML = passingTitle;
      }



//Get photos from a specific album with a passed albumId
      function getPhotosInAlbums(albumId){
        return gapi.client.photoslibrary.mediaItems.search({
          "resource": {
            "albumId": albumId
          }
        })
            .then(function(response) {
                    // Handle the results here (response.result has the parsed body).
                    //console.log("Response", response.result.mediaItems);
savePhotosInAlbum(response);
      for(x = 0; x < mediaItemsBaseArray.length; x++){
        var theDiv = document.getElementById("theDiv");
        theDiv.innerHTML += '<div class="col-md-4"><div class="card mb-4 box-shadow"><a data-fancybox="gallery" href = '+ mediaItemsBaseArray[x] + '><img class="bd-placeholder-img card-img-top" src='+ mediaItemsBaseArray[x] +' alt="Google Photo"></img></a><div class="card-body"><p class="card-text"></p><div class="d-flex justify-content-between align-items-center"><div class="btn-group"></div></div> </div></div>';
      }

                  },
                  function(err) { console.error("Execute error", err); });
      }




function savePhotosInAlbum(response){
  //store the album covers from json to the albumArray for future use
  for (i = 0; i < response.result.mediaItems.length; i++){
    mediaItemsIdArray[i] = response.result.mediaItems[i].id;
    mediaItemsBaseArray[i] = response.result.mediaItems[i].baseUrl;
    //console.log(mediaItemsBaseArray[i]);
}


}




//!!! END Functions used for album pages !!!!



//!!! START Functions used for photo pages !!!!

//get photos from Google Account
  function getPhotos(){
    return gapi.client.photoslibrary.mediaItems.list({
      "pageSize": numberPhotos
    })
        .then(function(response) {
          savePhotoData(response);
        //  displayPhotoData();
        displayPhotos();
          // console.log(response.result.nextPageToken);
              },
              function(err) { console.error("Execute error", err); });
  }


//save the data from response, saving media next pages, media items id, and media items photo link
function savePhotoData(response){
  console.log("Response", response.result);
  mediaNextPage = response.result.nextPageToken;
  //save to html data
  for (i = 0; i < response.result.mediaItems.length; i++){
    mediaItemsIdArray[i] = response.result.mediaItems[i].id;
    mediaItemsBaseArray[i] = response.result.mediaItems[i].baseUrl;

  }

}



function displayPhotoData() {
console.log(mediaNextPage);

}


//display the photos that are taken from photos Response
  function displayPhotos(){
    for(x = 0; x < mediaItemsBaseArray.length; x++){

      var theDiv = document.getElementById("theDiv");
      theDiv.innerHTML += '<div class="col-md-4"><div class="card mb-4 box-shadow"><a data-fancybox="gallery" href = '+ mediaItemsBaseArray[x] + '><img class="bd-placeholder-img card-img-top" src='+ mediaItemsBaseArray[x] +' alt="Google Photo"></img></a><div class="card-body"><p class="card-text"></p><div class="d-flex justify-content-between align-items-center"><div class="btn-group"> </div></div> </div></div>';
    }

  }




function passingPhotoPage(){
  localStorage.setItem("mediaNextPage", mediaNextPage);
  window.location.href = "http://weblab.salemstate.edu/~S0311569/login/photosContent.html";
}

function getPassingPhotoPage(){
  mediaNextPage = localStorage.getItem("mediaNextPage");

}
function getPhotosFromPage(){
    return gapi.client.photoslibrary.mediaItems.list({
      "pageSize": numberPhotos,
      "pageToken": mediaNextPage
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                savePhotoData(response);
                displayPhotos();



              },
              function(err) { console.error("Execute error", err); });
  }





  function checkToggle(state){


    let id = "myCheckbox(" +state+")";

console.log(document.getElementById(id).checked);

  if(document.getElementById(id).checked == true){

AlbumDisplayID.push(albumIdArray[state]);
// checkAlbumDisplayID();
//console.log(AlbumDisplayID.length);
stateVar.push(state);
localStorage.setItem("AlbumDisplayID", JSON.stringify(AlbumDisplayID));
localStorage.setItem("stateVar", JSON.stringify(stateVar));



  }

else if(document.getElementById(id).checked == false){
  //find where the correct index is
  //search the array for the location of the albumID
  var a = AlbumDisplayID.indexOf(albumIdArray[state]);
  //array.splice(index of removal, elements wish to be removed
  AlbumDisplayID.splice(a,1);
  //b is going to be the var that needs to be cut.
//check stateVar and find where state is an index
  var loc = stateVar.indexOf(state);
  stateVar.splice(loc,1);

  // console.log(AlbumDisplayID.length);
  localStorage.setItem("AlbumDisplayID", JSON.stringify(AlbumDisplayID));
  localStorage.setItem("stateVar", JSON.stringify(stateVar));
    }
  }


  function checkAlbumDisplayID(){
    for(x = 0; x < AlbumDisplayID.length; x++){
      console.log(AlbumDisplayID[x]);
  }
}


  function getAlbumDisplayIDArray(){
    let AlbumDisplayID = JSON.parse(localStorage.getItem("AlbumDisplayID"));

   console.log(AlbumDisplayID.length);
    checkAlbumDisplayID();


  }

  function getToggleState(){
    window.localStorage.length




if(localStorage.length > 0){
  stateVar = JSON.parse(localStorage.getItem("stateVar"));
}
else{
  localStorage.setItem("stateVar", JSON.stringify(stateVar));

}


  }









  function getAllAlbumPhotos(){
   console.log("Starting getAllAlbumPhotos");
// //for the length of passed AlbumDisplayID, log the ID
// //pass that id to the loop which will get the response, and SaveAll will push it into the mediaItemsIdArray

     for(x = 0; x < AlbumDisplayID.length; x++){
      getAllAlbumPhotosLoop(AlbumDisplayID[x]);


  }


 setTimeout(() => {  displayPhotos(); }, 3000);
}



  function saveAllAlbumPhotos(response){
    //save the Response by push
    for (i = 0; i < response.result.mediaItems.length; i++){
      //for the response, add it to respected placement
      mediaItemsIdArray.push(response.result.mediaItems[i].id);
      mediaItemsBaseArray.push(response.result.mediaItems[i].baseUrl);
      //console.log(mediaItemsBaseArray[i]);
    }


  }

  function getAllAlbumPhotosLoop(AlbumID){
    return gapi.client.photoslibrary.mediaItems.search({
      "resource": {
        "albumId": AlbumID
      }
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response.result);


                nextPageToken = response.result.nextPageToken;

                if(nextPageToken != null){
                  saveAllAlbumPhotos(response);
                  logPageToken(AlbumID);
                }

              else  if(nextPageToken == null){
                  //only one page of photos
                  console.log("pageToken is null");
                  saveAllAlbumPhotos(response);
                }



              });

  }


function logPageToken(AlbumID){
console.log(nextPageToken);



  console.log("not null");
  //get the next responce
while(nextPageToken != null){
  //console.log(nextPageToken);
  return gapi.client.photoslibrary.mediaItems.search({
        "resource": {
          //breaking because I left it with invalid albumID
          "albumId": AlbumID,
          "pageToken": nextPageToken
        }
      })
          .then(function(response) {
                  // Handle the results here (response.result has the parsed body).
                  console.log("Response", response);
                  saveAllAlbumPhotos(response);

                  nextPageToken = response.result.nextPageToken;
                  logPageToken();

                },
                function(err) { console.error("Execute error", err); });


}


}

// localStorage.setItem("stateVar", JSON.stringify(stateVar));

function checkingStateVar(){
if(stateVar != null){

for(a = 0; a < stateVar.length; a++){
  console.log(a);
  var tmp = stateVar[a];

  //currently just setting the correct number of albums to check.. needs to check the indexes
  document.getElementById('myCheckbox('+tmp+')').checked = true;

}

}

  else{
    console.log("stateVar null");
  }
}






function checkingStateVar(){
let tmp = JSON.parse(localStorage.getItem("stateVar"));
console.log(tmp);
if(tmp != null){
  if(tmp.length > 0){
  console.log("stateVar exists");
  for(x = 0; x < tmp.length; x++){
    var toggle = tmp[x];
    console.log(toggle);
    document.getElementById('myCheckbox('+toggle+')').checked = true;
    //localStorage.setItem("stateVar", JSON.stringify(stateVar));
  }

  }
  else if(tmp <= 0){
    console.log("stateVar does not exist");

  }
}
else if(tmp == null){
  console.log("stateVar does not exist");
}

}
