let ipcRenderer = null
if (process.env.REACT_APP_IS_WEB_MODE === 'false') {
  const electron = window.require('electron')
  ipcRenderer  = electron.ipcRenderer

}
export default ipcRenderer

export function addIpcFileListenerOnce (cb) {
  ipcRenderer.once('open-file-dialog-reply', (event, payload) => {
    console.log('open-file-dialog-reply arrived!!', event, payload)
    // store.dispatch({type: 'IPC_MESSAGE_ARRIVED', payload})
    cb(payload)
  })
}

export function openIpcFileDialog(){
  console.log('send: open-file-dialog')
  sendAsyncMsg('open-file-dialog')
}

function sendAsyncMsg(msg){
  ipcRenderer.send('asynchronous-message', msg)
}

export function openFileDialogSync(){
  return sendSyncMsgGetResult('open-file-dialog')
}

function sendSyncMsgGetResult(msg){
  return ipcRenderer.sendSync('synchronous-message', msg)
}

export function addAsyncMsgListener(){
  ipcRenderer.on('asynchronous-message', (event, arg) => {
    console.log('asynchronous-message-reply', event, arg) // prints "pong"
  })
}