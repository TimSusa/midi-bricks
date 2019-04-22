let ipcRenderer = null

if (process.env.REACT_APP_IS_WEB_MODE === 'false') {
  ipcRenderer  = window.require('electron').ipcRenderer
}

export function addIpcFileListenerOnce (cb) {
  ipcRenderer.once('open-file-dialog-reply', (event, payload) => {
    // mostly this will trigger onFileLoad
    cb(payload)
  })
}

export function openIpcFileDialog(){
  sendAsyncMsg('open-file-dialog', {})
}

export function addIpcSaveFileListenerOnce (cb) {
  ipcRenderer.once('save-file-dialog-reply', (event, payload) => {
    // mostly this will trigger onFileLoad
    cb(payload)
  })
}

export function saveIpcFileDialog(payload){
  sendAsyncMsg('save-file-dialog', payload)
}

export function openFileDialogSync(){
  return sendSyncMsgGetResult('open-file-dialog')
}

export function requestVersion(){
  sendAsyncMsg('get-version', {})
}

export function listenToVersion(cb){
  ipcRenderer.once('get-version-reply', (event, payload) => {
    // mostly this will trigger onFileLoad
    console.log('get-version-reply', payload)

    cb(payload)
  })
}

function sendAsyncMsg(msg, payload){
  ipcRenderer.send(msg, payload)
}

function sendSyncMsgGetResult(msg){
  return ipcRenderer.sendSync(msg)
}

