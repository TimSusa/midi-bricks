let appRuntime = null

if (process.env.REACT_APP_IS_WEB_MODE === 'false') {
  appRuntime = window.appRuntime
}

export default appRuntime
