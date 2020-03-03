"use strict";

const { app, BrowserWindow } = require('electron')

const config = require('./config.js');


// Set up OAuth 2.0 authentication through the passport.js library.
const passport = require('passport');
const auth = require('./auth');
auth(passport);

// passport.initialize());
// passport.session();

let mainWindow;

function createWindow () {
  app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
  var electronOptionsDefaults = {
    width: 800,
    height: 600,
    x: 0,
    y: 0,
    darkTheme: true,
    webPreferences: {
      nodeIntegration: false,
      zoomFactor: config.zoom
    },
    backgroundColor: "#FFFFFF"
};

if (config.kioskmode) {
  electronOptionsDefaults.kiosk = true;
} else {
  electronOptionsDefaults.fullscreen = false;
  electronOptionsDefaults.autoHideMenuBar = true;
}
var electronOptions = Object.assign({}, electronOptionsDefaults, config.electronOptions);

//create a window with default options
mainWindow = new BrowserWindow(electronOptions);
var address = (config.address === void 0) | (config.address === "") ? (config.address = "localhost") : config.address;

//mainWindow.loadURL('http://127.0.0.1.xip.io:8080/index.html');
mainWindow.loadURL(`http://${address}.${config.xip}:${config.port}`);

  // Open the DevTools if run with "npm start dev"
  if (process.argv.includes("dev")) {
    mainWindow.webContents.openDevTools();
  }

  // Set responders for window events.
	mainWindow.on("closed", function() {
		mainWindow = null;
	});
  if (config.kioskmode) {
    mainWindow.on("blur", function() {
      mainWindow.focus();
    });

    mainWindow.on("leave-full-screen", function() {
      mainWindow.setFullScreen(true);
    });

    mainWindow.on("resize", function() {
      setTimeout(function() {
        mainWindow.reload();
      }, 1000);
    });
  }

  }


  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  app.on("ready", function() {
  	console.log("Launching application.");
    console.log("Starting Server");


  	createWindow();
  });



  // Quit when all windows are closed.
  app.on("window-all-closed", function() {
  app.quit();
  });


  app.on("activate", function() {
  	// On OS X it's common to re-create a window in the app when the
  	// dock icon is clicked and there are no other windows open.
  	if (mainWindow === null) {
  		createWindow();
  	}
  });


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
