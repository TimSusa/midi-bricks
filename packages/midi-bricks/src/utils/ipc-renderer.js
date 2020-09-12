// import {isEmpty, isObject} from 'lodash'
import ipcRenderer from './ipc-runtime.js'

export function addIpcFileListenerOnce (cb) {
  ipcRenderer.once('open-file-dialog-reply', (event) => {
    cb(event)
  })
}

export function openIpcFileDialog () {
  sendAsyncMsg('open-file-dialog', {})
}

export function addIpcSaveFileListenerOnce (cb) {
  ipcRenderer.once('save-file-dialog-reply', (event) => {
    cb(event)
  })
}

// export function openFileDialogSync () {
//   return sendSyncMsgGetResult('open-file-dialog')
// }

export function saveIpcFileDialog (payload) {
  sendAsyncMsg('save-file-dialog', payload)
}

export function sendAppSettings (payload) {
  sendAsyncMsg('send-app-settings', payload)
}
export function setActualWinCoords (payload) {
  sendAsyncMsg('set-to-actual-win-coords', {...payload})
}
export function addIpcWindowCoordsListenerOnce (cb) {
  ipcRenderer.once('set-to-actual-win-coords-reply', (event, payload) => {
    cb(payload)
  })
}

function sendAsyncMsg (msg, payload) {
  
  ipcRenderer.send(msg, payload)
  // if (Array.isArray(payload)) {
  //   ipcRenderer.send(msg, {...payload})

  // } else if (isEmpty(payload)) {
  //   ipcRenderer.send(msg, {})
  // } 
  // else {
  //   if (!isObject(payload)) console.warn('NO OBJECT IN IPC!!', payload)
  //   ipcRenderer.send(msg, payload)
  // }
}

// function sendSyncMsgGetResult (msg) {
//   return ipcRenderer.sendSync(msg)
// }
