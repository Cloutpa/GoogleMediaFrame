const { app, BrowserWindow} = require('electron');
const path = require('path');



function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: "preload.js"
  }
  })

  mainWindow.loadURL("http://weblab.salemstate.edu/~S0311569/login/login.html", {userAgent: 'chromium'});

}
app.on("ready", function() {

  console.log("Launching application.");
  createWindow();


});
// Quit when all windows are closed.
app.on('window-all-closed', () => {
    app.quit();

});

app.on('activate', () => {

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
