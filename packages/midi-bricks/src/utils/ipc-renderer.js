let ipcRenderer = null

if (process.env.REACT_APP_IS_WEB_MODE === 'false') {
  ipcRenderer = window.require('electron').ipcRenderer
}

export function addIpcFileListenerOnce(cb) {
  ipcRenderer.once('open-file-dialog-reply', (event, payload) => {
    //  this will trigger onFileLoad
    cb(payload)
  })
}

export function openIpcFileDialog() {
  sendAsyncMsg('open-file-dialog', {})
}

export function addIpcSaveFileListenerOnce(cb) {
  ipcRenderer.once('save-file-dialog-reply', (event, payload) => {
    //  this will trigger onFileLoad
    cb(payload)
  })
}

export function openFileDialogSync() {
  return sendSyncMsgGetResult('open-file-dialog')
}

export function saveIpcFileDialog(payload) {
  sendAsyncMsg('save-file-dialog', payload)
}

export function sendAppSettings(payload) {
  sendAsyncMsg('send-app-settings', payload)
}
export function setActualWinCoords(payload) {
  sendAsyncMsg('set-to-actual-win-coords', payload)
}
export function addIpcWindowCoordsListenerOnce(cb) {
  ipcRenderer.once('set-to-actual-win-coords-reply', (event, payload) => {
    //  this will trigger onFileLoad
    cb(payload)
  })
}
export function setTunnelUrl(payload) {
  sendAsyncMsg('set-to-actual-tunnel-url', payload)
}
export function addIpcTunnelUrlListenerOnce(cb) {
  ipcRenderer.once('set-to-actual-tunnel-url-reply', (event, payload) => {
    cb(payload)
  })
}

function sendAsyncMsg(msg, payload) {
  ipcRenderer.send(msg, payload)
}

function sendSyncMsgGetResult(msg) {
  return ipcRenderer.sendSync(msg)
}
