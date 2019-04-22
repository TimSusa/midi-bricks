let ipcRenderer = null
if (process.env.REACT_APP_IS_WEB_MODE === 'false') {
  const electron = window.require('electron')
  ipcRenderer  = electron.ipcRenderer

}
export default ipcRenderer

export function addIpcFileListenerOnce (cb) {
  ipcRenderer.once('open-file-dialog-reply', (event, payload) => {
    console.log('open-file-dialog-reply arrived!!', event, payload)
    // mostly this will trigger onFileLoad
    cb(payload)
  })
}

export function openIpcFileDialog(){
  console.log('send: open-file-dialog')
  sendAsyncMsg('open-file-dialog', {})
}

export function addIpcSaveFileListenerOnce (cb) {
  ipcRenderer.once('save-file-dialog-reply', (event, payload) => {
    console.log('save-file-dialog-reply arrived!!', event, payload)
    cb(payload)
  })
}

export function saveIpcFileDialog(payload){
  console.log('send: save-file-dialog with payload', payload)
  sendAsyncMsg('save-file-dialog', payload)
}

function sendAsyncMsg(msg, payload){
  ipcRenderer.send(msg, payload)
}

export function openFileDialogSync(){
  return sendSyncMsgGetResult('open-file-dialog')
}

function sendSyncMsgGetResult(msg){
  return ipcRenderer.sendSync(msg)
}

// export function addAsyncMsgListener(){
//   ipcRenderer.on('asynchronous-message', (event, arg) => {
//     console.log('asynchronous-message-reply', event, arg) // prints "pong"
//   })
// }