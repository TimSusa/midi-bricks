const { BrowserWindow, app } = require('electron')
const path = require('path')
const fs = require('fs')
const isDev = require('electron-is-dev')
const windowStateKeeper = require('electron-window-state')
require('electron').process

// In main process.
const { ipcMain, dialog } = require('electron')
const log = require('electron-log')
const { autoUpdater } = require('electron-updater')
//-------------------------------------------------------------------
// Logging
//
// THIS SECTION IS NOT REQUIRED
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')

let win = null

// Prevent Zoom, disrupting touches
!isDev && app.commandLine.appendSwitch('disable-pinch')
!isDev && app.commandLine.appendSwitch('overscroll-history-navigation=0')

autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...')
  sendStatusToWindow('Checking for update...')
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.')
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.')
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err)
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = 'Download speed: ' + progressObj.bytesPerSecond
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  log_message =
    log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
  sendStatusToWindow(log_message)
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded')
})

// ENSURE ONE WINDOW
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    console.log('Someone tried to run a second instance, we should focus our window.')
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  // Create myWindow, load the rest of the app, etc...
  app.on('ready', () => {
  })
}

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
  autoUpdater.checkForUpdatesAndNotify()

  // Extract CLI parameter: Window Coordinates
  const windowIndex = process.argv.findIndex((item) => item === '--window') + 1
  const [xx, yy, w, h] = process.argv[windowIndex].split(',')

  // Extract CLI parameter: Enable Dev Console
  const isDevelopmentCli =
    isDev || !!process.argv.find((item) => item === '--dev')

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

  // const pathToIcon = './icons/icon_512@1x.png'
  // console.log('patchx exists?', path.exists(pathToIcon))
  // Create the window using the state information
  win = new BrowserWindow({
    x,
    y,
    width,
    height,
    webPreferences: {
      nodeIntegration: true
    },
    title: 'MIDI Bricks',
    vibrancy: 'dark'
    // frame: false,
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
  // isDevelopmentCli && win.webContents.openDevTools()
  win.webContents.openDevTools()

  win.webContents.session.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      // eslint-disable-next-line standard/no-callback-literal
      callback(true)
    }
  )

  // Register IPC
  ipcMain.on('open-file-dialog', (event, arg) => {
    dialog.showOpenDialog(
      {
        properties: ['openFile'],
        filters: [
          {
            name: 'javascript',
            extensions: ['js']
          },
          {
            name: 'json',
            extensions: ['json']
          }
        ]
      },
      (filenames) => {
        if (filenames === undefined) {
          return
        }
        fs.readFile(filenames[0], {}, (err, data) => {
          const stuff = { content: JSON.parse(data), presetName: filenames[0] }
          event.sender.send('open-file-dialog-reply', stuff)
        })
      }
    )
  })

  ipcMain.on('save-file-dialog', (event, arg) => {
    dialog.showSaveDialog(
      {
        properties: ['openFile'],
        defaultPath: app.getAppPath(),
        filters: [
          {
            name: 'javascript',
            extensions: ['js']
          },
          {
            name: 'json',
            extensions: ['json']
          }
        ]
      },
      (filename, bookmark) => {
        if (filename === undefined) {
          return
        }
        const json = JSON.stringify(arg)
        fs.writeFile(filename, json, 'utf8', (err, data) => {
          if (err) {
            throw new Error(err)
          }
        })
        event.sender.send('save-file-dialog-reply', {
          presetName: filename,
          content: arg
        })
      }
    )
  })

  const url = isDev
    ? 'http://localhost:3000/'
    : `file://${path.join(__dirname, '../build/index.html')}`

  win.loadURL(url)

  //  Emitted when the window is closed.
  win.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}


function sendStatusToWindow(text) {
  log.info(text)
  win.webContents.send('message', text)
}