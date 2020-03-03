   function onSuccess(googleUser) {
     var profile = googleUser.getBasicProfile();
     console.log("ID:  " + profile.getId());
     console.log('Full Name: ' + profile.getName());
     console.log("Image URL: " + profile.getImageUrl());
     console.log("Email: " + profile.getEmail());
   }

   function onFailure(error) {
     console.log(error);
   }


   function renderButton() {
     gapi.signin2.render('my-signin2', {
       'scope': 'profile email',
       'width': 240,
       'height': 50,
       'longtitle': true,
       'theme': 'dark',
       'onsuccess': onSuccess,
       'onfailure': onFailure
     });
   }