// const { dialog } = require('electron')
// const log = require('electron-log')
// const { autoUpdater } = require('electron-updater')

// module.exports = {
//   setUp
// }

// let updater = null

// function setUp({ isAutoDownload, isAllowedPrerelease, isAllowedDowngrade }) {
//   log.info('setUp... ', {
//     isAutoDownload,
//     isAllowedPrerelease,
//     isAllowedDowngrade
//   })
//   autoUpdater.autoDownload = isAutoDownload
//   autoUpdater.allowPrerelease = isAllowedPrerelease
//   autoUpdater.allowDowngrade = isAllowedDowngrade
//   autoUpdater.logger = log
//   autoUpdater.logger.transports.file.level = 'info'
//   log.info('checkForUpdates')
//   autoUpdater.checkForUpdates()
//   startAutoUpdater(autoUpdater)
// }

// function startAutoUpdater(autoUpdater) {
//   autoUpdater.on('error', (error) => {
//     log.error(error)
//     dialog.showErrorBox(
//       'Error: ',
//       error == null ? 'unknown' : (error.stack || error).toString()
//     )
//   })

//   autoUpdater.on('update-available', (evt) => {
//     log.info('update-available: ', evt.version || 'no version found')
//     dialog.showMessageBox(
//       {
//         type: 'info',
//         title: 'Found Updates',
//         message: 'Found updates, do you want update now?',
//         buttons: ['Sure', 'No']
//       },
//       (buttonIndex) => {
//         if (buttonIndex === 0) {
//           autoUpdater.downloadUpdate()
//         } else {
//           updater.enabled = true
//           updater = null
//         }
//       }
//     )
//   })

//   autoUpdater.on('download-progress', (progressObj) => {
//     const mBitPerSec = progressObj.bytesPerSecond / (1024 * 1024)
//     const progressInPercent = parseInt(progressObj.percent, 10)
//     let logMsg = 'Download speed: ' + mBitPerSec
//     logMsg = logMsg + ' - Downloaded ' + progressInPercent + '%'
//     logMsg =
//       logMsg +
//       ' (' +
//       parseInt(progressObj.transferred, 10) +
//       '/' +
//       parseInt(progressObj.total, 10) +
//       ')'

//     log.info(logMsg)
//   })

//   // autoUpdater.on('update-not-available', () => {
//   //   dialog.showMessageBox({
//   //     title: 'No Updates',
//   //     message: 'Current version is up-to-date.'
//   //   })
//   //   updater.enabled = true
//   //   updater = null
//   // })

//   autoUpdater.on('update-downloaded', (tmp) => {
//     log.info('downloaded version: ', tmp.version || 'no vers was given')
//     dialog.showMessageBox(
//       {
//         title: 'Install Updates',
//         message:
//           'The App has to be closed to get installed to Version: ' +
//             tmp.version || 'no vers was given'
//       },
//       () => {
//         setImmediate(() => autoUpdater.quitAndInstall())
//       }
//     )
//   })
// }
