let appRuntime = null

if (process.env.REACT_APP_IS_WEB_MODE !== 'true') {
  appRuntime = window.appRuntime
}

export default appRuntime
