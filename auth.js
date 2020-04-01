


function onSignIn(googleUser) {
 console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
 console.log('Users image URL: ' + googleUser.getBasicProfile().getImageUrl());

           document.getElementById('name').innerText = "Signed in: " + googleUser.getBasicProfile().getName();
           let pictureLink = googleUser.getBasicProfile().getImageUrl();
           document.querySelector(".id-of-img-tag").src = pictureLink;
}


  function onFailure(error) {
    console.log(error);
  }


  function renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email https://www.googleapis.com/auth/photoslibrary.readonly',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': onSignIn,
      'onfailure': onFailure
    });
  }
  function signOut() {
    var revokeAllScopes = function() {
      auth2.disconnect();
    }
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });



  }
