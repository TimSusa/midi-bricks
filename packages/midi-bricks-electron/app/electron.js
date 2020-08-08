const {
  BrowserWindow,
  app,
  Notification,
  ipcMain,
  dialog
} = require('electron')
const path = require('path')
const fs = require('fs')
const isDev = require('electron-is-dev')
const windowStateKeeper = require('electron-window-state')
const log = require('electron-log')
const util = require('util')
const readFile = util.promisify(fs.readFile)
const doesFileExist = util.promisify(fs.stat)

// eslint-disable-next-line no-unused-expressions
require('electron').process

let win = null
let appSettings = null
let appInitSettings = {
  isDevConsoleEnabled: isDev,
  isWindowSizeLocked: true,
  windowCoords: [0, 0, 300, 400],
  isAllowedToUpdate: true,
  isAutoDownload: false,
  isAllowedPrerelease: false,
  isAllowedDowngrade: false
}
log.info(app.getPath('userData'))

const persistedAppSettingsFileName =
  app.getPath('userData') + '/midi-bricks-persisted-app-settings.json'

let notification = null

// Prevent Zoom, disrupting touches
!isDev && app.commandLine.appendSwitch('disable-pinch')
!isDev && app.commandLine.appendSwitch('overscroll-history-navigation=0')

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    log.info(
      'Someone tried to run a second instance, we should focus our window.'
    )
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  // Create myWindow, load the rest of the app, etc...
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)

  // Quit when all windows are closed.
  app.on('window-all-closed', function() {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    appSettings = null
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('activate', function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) createWindow()
  })
}

async function createWindow() {

  // app.allowRendererProcessReuse = false
  // eslint-disable-next-line require-atomic-updates
  appSettings = (await readoutPersistedAppsettings(appSettings)) || {}
  log.info('App started... ! ', appSettings)

  // Extract CLI parameter: Enable Dev Console
  const isDevelopmentCli =
    (process.argv.find((item) => item === '--dev') !== undefined &&
      !!process.argv.find((item) => item === '--dev')) ||
    appSettings.isDevConsoleEnabled

  // Extract CLI parameter: Enable Auto Update
  isDevelopmentCli && log.info('isDevelopmentCli is enabled! ')
  // const isAllowedToUpdateCli = process.argv.find(
  //   (item) => item === '--noUpdate'
  // )

  // const isAllowedToUpdate =
  //   appSettings.isAllowedToUpdate !== undefined
  //     ? appSettings.isAllowedToUpdate
  //     : isAllowedToUpdateCli
  // !isAllowedToUpdate && log.warn('Updates were disabled! ')

  // TO DO CLEAN OUT
  // if (isAllowedToUpdate && !isDev) {
  //   const {
  //     isAutoDownload = appInitSettings.isAutoDownload,
  //     isAllowedPrerelease = appInitSettings.isAllowedPrerelease,
  //     isAllowedDowngrade = appInitSettings.isAllowedDowngrade
  //   } = appSettings

  //   require('./update').setUp({
  //     isAutoDownload,
  //     isAllowedPrerelease,
  //     isAllowedDowngrade
  //   })
  // }

  // Load the previous state with fallback to defaults
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800
  })

  // Extract CLI parameter: Window Coordinates
  const windowIndex = process.argv.findIndex((item) => item === '--window') + 1
  const [xx, yy, w, h] = process.argv[windowIndex].split(',')

  const [xSet, ySet, widthSet, heightSet] = appSettings.windowCoords || []
  const { x, y, width, height } =
    {
      x: parseInt(((yy && w && h && xx) || xSet ) || 0, 10),
      y: parseInt((yy || ySet), 10),
      width: parseInt((w || widthSet), 10),
      height: parseInt((h || heightSet), 10)
    } 
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
    // vibrancy: 'dark'
    // titlebarAppearsTransparent: true
  })
  win.setMenu(null)

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  mainWindowState.manage(win)

  // Check for develper console
  isDevelopmentCli && win.webContents.openDevTools()

  win.webContents.session.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      callback(true)
    }
  )

  // Register IPC
  ipcMain.on('open-file-dialog', onOpenFileDialog)
  ipcMain.on('save-file-dialog', onSaveFileDialog)
  ipcMain.on('send-app-settings', onSetAppSettings)
  ipcMain.on('set-to-actual-win-coords', onSetActualWinCoords)

  const url = isDev
    ? 'http://localhost:3000/'
    : `file://${path.join(__dirname, '../index.html')}`

  win.loadURL(url)
  // isAllowedToUpdate && sendStatusToWindow('Software-Updates enabled.')

  //  Emitted when the window is closed.
  win.on('closed', function() {
    //sendStatusToWindow('Gracefully shutting down.')
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// function sendStatusToWindow(title, subtitle, text) {
//   log.info(title)
//   if (!Notification.isSupported()) {
//     log.warn('notifcations are not supported on this OS')
//     return
//   }
//   notification = new Notification({
//     title: title || 'txt is not there',
//     // subtitle: text,
//     body: text,
//     silent: true,
//     sound: '',
//     // icon: './icons/icon-128x128.png'
//   })

//   eventListen(notification)
//   notification.show()
//   //notification.close()
// }

// function eventListen(notificationn) {
//   return notificationn.once('click', () => {
//     log.info('Notification clicked')
//     notificationn.close()
//   })
// }

function onSaveFileDialog(event, arg) {
  dialog.showSaveDialog(
    {
      properties: ['openFile'],
      defaultPath: app.getPath('userData'),
      filters: [
        {
          name: 'midi-bricks-preset',
          extensions: ['json', 'js']
        }
      ]
    },
    (filename, bookmark) => {
      if (filename === undefined) {
        return
      }
      const json = JSON.stringify(arg)

      fs.writeFile(filename, json, { flag: 'w' }, (err, data) => {
        if (err) {
          throw new Error(err)
        }
      })

      appSettings = persistAppSettings(arg)
      event.sender.send('save-file-dialog-reply', {
        presetName: filename,
        content: arg
      })
    }
  )
}

function onOpenFileDialog(event, arg) {
  dialog.showOpenDialog(
    {
      properties: ['openFile'],
      filters: [
        {
          name: 'midi-bricks-preset',
          extensions: ['json', 'js']
        }
      ]
    },
    (filenames) => {
      Array.isArray(filenames) &&
        readFile(filenames[0], {}).then(
          (data) => {
            const args = JSON.parse(data)
            const stuff = {
              content: args,
              presetName: filenames[0]
            }
            appSettings = persistAppSettings(args)
            event.sender.send('open-file-dialog-reply', stuff)
            log.info('Object loaded: ')
            return data
          },
          (err) => {
            console.error(err)
          }
        )
    }
  )
}

function onSetAppSettings(event, arg) {
  appSettings = persistAppSettings({
    viewSettings: {
      electronAppSettings: { ...appSettings, ...arg }
    }
  })
}
function onSetActualWinCoords(event, arg) {
  const { x, y, width, height } = win.getBounds()
  appSettings = persistAppSettings({
    viewSettings: {
      electronAppSettings: {
        ...appSettings,
        windowCoords: [x, y, width, height]
      }
    }
  })
  event.sender.send('set-to-actual-win-coords-reply', [x, y, width, height])
  return [x, y, width, height]
}
async function readoutPersistedAppsettings(appSettingss = appInitSettings) {
  // Try to read out persisted app-settings:
  try {
    const isExisting = await doesFileExist(persistedAppSettingsFileName)
    if (isExisting) {
      const res = await readFile(persistedAppSettingsFileName)
      const data = JSON.parse(res)
      appSettingss = data
      return data
    }
  } catch (error) {
    log.warn('App Settings Warning: ', 'Try to create settings-file')

    const persJson = JSON.stringify(appSettingss)
    fs.writeFile(
      persistedAppSettingsFileName,
      persJson,
      { flag: 'w' },
      (err, data) => {
        if (err) {
          throw new Error(err)
        }
        return appSettingss
      }
    )
  }
}

function persistAppSettings(arg) {
  const {
    viewSettings: {
      electronAppSettings: {
        isDevConsoleEnabled,
        isAllowedToUpdate,
        isAutoDownload,
        isAllowedDowngrade,
        isAllowedPrerelease,
        isWindowSizeLocked,
        windowCoords
      } = appInitSettings
    }
  } = arg || {}

  const freshContent = {
    isAllowedToUpdate:
      isAllowedToUpdate !== undefined ? isAllowedToUpdate : undefined,
    isAutoDownload: isAutoDownload !== undefined ? isAutoDownload : undefined,
    isAllowedDowngrade:
      isAllowedDowngrade !== undefined ? isAllowedDowngrade : undefined,
    isAllowedPrerelease:
      isAllowedPrerelease !== undefined ? isAllowedPrerelease : undefined,
    isDevConsoleEnabled:
      isDevConsoleEnabled !== undefined ? isDevConsoleEnabled : undefined,
    isWindowSizeLocked:
      isWindowSizeLocked !== undefined ? isWindowSizeLocked : undefined,
    windowCoords: Array.isArray(windowCoords) ? windowCoords : undefined
  }

  const jsonRefreshed = JSON.stringify(freshContent)

  fs.writeFile(
    persistedAppSettingsFileName,
    jsonRefreshed,
    { flag: 'w' },
    (err, data) => {
      if (err) {
        throw new Error(err)
      } else {
        log.info(
          'App Settings written: ',
          jsonRefreshed,
          ' to: ',
          persistedAppSettingsFileName
        )
      }
    }
  )

  return freshContent
}
