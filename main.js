// main.js

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { exec } = require("child_process");

let mainWindow;
let scriptRunning = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (mainWindow === null) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("toggle-script", (event) => {
  if (scriptRunning) {
    // If script is running, stop it
    scriptRunning = false;
    mainWindow.webContents.send("script-status", false);
  } else {
    // If script is not running, start it
    scriptRunning = true;
    mainWindow.webContents.send("script-status", true);
    // Start the Selenium script
    runSeleniumScript();
  }
});

// Run the Selenium script
function runSeleniumScript() {
  const scriptPath = path.join(__dirname, "./script.js"); // Replace with the actual path to your script file
  const command = `node ${scriptPath}`;

  const child = exec(command);

  child.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  child.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  child.on("close", (code) => {
    console.log(`Child process exited with code ${code}`);
    scriptRunning = false;
    mainWindow.webContents.send("script-status", false);
  });
}

// function updateRendererWithAcceptedJob() {
//   if (mainWindow) {
//     mainWindow.webContents.send("job-accepted", "A job was accepted");
//   }
// }
