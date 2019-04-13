const { BrowserWindow, app, ipcMain } = require("electron");
require("electron").process;
const path = require("path");
const isDev = require("electron-is-dev");
const windowStateKeeper = require("electron-window-state");
let win;

// Prevent Zoom, disrupting touches
!isDev && app.commandLine.appendSwitch("disable-pinch");
!isDev && app.commandLine.appendSwitch("overscroll-history-navigation=0");

// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) createWindow();
});

function createWindow() {
  const windowIndex = process.argv.findIndex((item) => item === "--window") + 1;
  const val = process.argv[windowIndex].split(",");
  console.log("arguments: ", val);
  // Load the previous state with fallback to defaults
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800
  });

  const { x, y, width, height } =
    {
      x: parseInt(val[0], 10),
      y: parseInt(val[1]),
      width: parseInt(val[2], 10),
      height: parseInt(val[3], 10)
    } || mainWindowState;

  // Create the window using the state information
  win = new BrowserWindow({
    x,
    y,
    width,
    height,
    webPreferences: {
      nodeIntegration: true
    },
    icon: path.join(__dirname, "icons/512x512.png")
  });

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  mainWindowState.manage(win);

  //isDev && win.webContents.openDevTools();
  win.webContents.openDevTools();

  win.webContents.session.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      console.log("granted permission:", permission);
      // eslint-disable-next-line standard/no-callback-literal
      callback(true);
    }
  );

  const url = isDev
    ? "http://localhost:3000/"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  console.log("load url");
  win.loadURL(url);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on("closed", function() {
    console.log("close window");
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}
