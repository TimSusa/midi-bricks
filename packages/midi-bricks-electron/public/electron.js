const { BrowserWindow, app } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
const windowStateKeeper = require('electron-window-state')
const { ipcMain } = require('electron')
let win

// Prevent Zoom, disrupting touches
!isDev && app.commandLine.appendSwitch('disable-pinch')
!isDev && app.commandLine.appendSwitch('overscroll-history-navigation=0')

app.on('ready', async () => {
  // Load the previous state with fallback to defaults
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800
  })

  ipcMain.on('asynchronous-message', (event, arg) => {
    console.log('electron says: ', arg) // prints "ping"
    //event.sender.send('asynchronous-reply', 'pong')
  })

  // Create the window using the state information
  win = new BrowserWindow({
    'x': mainWindowState.x,
    'y': mainWindowState.y,
    'width': mainWindowState.width,
    'height': mainWindowState.height,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  mainWindowState.manage(win)

  isDev && win.webContents.openDevTools()

  win.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    console.log('granted permission:', permission)
    // eslint-disable-next-line standard/no-callback-literal
    callback(true)
  })

  const url = isDev
    ? 'http://localhost:3000/'
    : `file://${path.join(__dirname, '../build/index.html')}`

  win.loadURL(url)
})

app.on('window-all-closed', app.quit)