const { app, BrowserWindow} = require('electron');
const path = require('path');
//for server
const handler = require('serve-handler');
const http = require('http');

const server = http.createServer((request, response) => {
  return handler(request, response);
})


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
//mainWindow.loadURL("http://127.0.0.1.xip.io:8080/src");
  // and load the index.html of the app.
  mainWindow.loadURL("http://127.0.0.1.xip.io:8080/src/");

  // Open the DevTools.
   //mainWindow.webContents.openDevTools()

}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", function() {
  console.log("Launching server.");

  server.listen(8080, () => {
    console.log('Running at http://localhost:8080');
  });


  //Before app opens start other processes
  console.log("Launching application.");
  createWindow();


});
// Quit when all windows are closed.
app.on('window-all-closed', () => {
    app.quit();

});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
