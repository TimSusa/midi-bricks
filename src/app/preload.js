const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld(
  'appRuntime', {
    send: (channel, data) => {
      console.log('send app runtime', channel, data)
      ipcRenderer.send(channel, data)
    },
    on: (channel, listener) => {
      const subscription = (event, ...args) => listener(...args)
      ipcRenderer.on(channel, subscription)
      console.log('on app runtime', channel)
      return () => {
        ipcRenderer.removeListener(channel, subscription)
      }
    },
    once: (channel, listener) => {
      const subscription = (event, ...args) => listener(...args)
      ipcRenderer.once(channel, subscription)
      console.log('once  app runtime')
      return () => {
        ipcRenderer.removeListener(channel, subscription)
      }
    }
  }
)
