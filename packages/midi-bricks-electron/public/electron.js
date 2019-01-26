import { BrowserWindow, app } from 'electron'
import path from 'path'
import isDev from 'electron-is-dev'
import windowStateKeeper from 'electron-window-state'

let win

// const server = 'https://hazel-euwqzahun.now.sh'
// const feed = `${server}/update/${process.platform}/${app.getVersion()}`

//autoUpdater.setFeedURL(feed)

// Prevent Zoom, disrupting touches
app.commandLine.appendSwitch('disable-pinch')
app.commandLine.appendSwitch('overscroll-history-navigation=0')

app.on('ready', async () => {
  // Load the previous state with fallback to defaults
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800
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

  win.webContents.openDevTools()

  win.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    console.log('granted permission:', permission)
    // eslint-disable-next-line standard/no-callback-literal
    callback(true)
  })

  const url = isDev
    ? 'http://localhost:3000/'
    // eslint-disable-next-line
    : `file://${path.join(__dirname, '../build/index.html')}`

  win.loadURL(url)
})

app.on('window-all-closed', app.quit)
