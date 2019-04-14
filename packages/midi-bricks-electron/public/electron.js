const { BrowserWindow, app } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
const windowStateKeeper = require('electron-window-state')
require('electron').process

let win

// Prevent Zoom, disrupting touches
!isDev && app.commandLine.appendSwitch('disable-pinch')
!isDev && app.commandLine.appendSwitch('overscroll-history-navigation=0')

// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) createWindow()
})

function createWindow() {
  // Extract CLI parameter: Window Coordinates
  const windowIndex = process.argv.findIndex(item => item === '--window') + 1
  const [xx, yy, w, h] = process.argv[windowIndex].split(',')

  // Extract CLI parameter: Enable Dev Console
  const isDevelopmentCli =
    isDev || !!process.argv.find(item => item === '--dev')

  // Load the previous state with fallback to defaults
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800
  })

  const { x, y, width, height } =
    {
      x: parseInt(xx, 10),
      y: parseInt(yy, 10),
      width: parseInt(w, 10),
      height: parseInt(h, 10)
    } || mainWindowState

  // Create the window using the state information
  win = new BrowserWindow({
    x,
    y,
    width,
    height,
    webPreferences: {
      nodeIntegration: true
    },
    icon: path.join(__dirname, 'icons', '310x310.png'),
    title: 'MIDI Bricks',
    //frame: false,
    //titleBarStyle: 'hidden',
    //skipTaskbar: false,
    //toolbar: false
  })

  //win.setMenu(null)

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  mainWindowState.manage(win)

  // Check for develper console
  isDevelopmentCli && win.webContents.openDevTools()

  win.webContents.session.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      // eslint-disable-next-line standard/no-callback-literal
      callback(true)
    }
  )

  const url = isDev
    ? 'http://localhost:3000/'
    : `file://${path.join(__dirname, '../build/index.html')}`

  win.loadURL(url)

  // Emitted when the window is closed.
  win.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}
