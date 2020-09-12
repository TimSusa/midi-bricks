import { CssBaseline, createMuiTheme } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import 'typeface-roboto'
import { darkTheme } from '../themes/dark-theme'
import { lightTheme } from '../themes/light-theme'
import App from '../App'

export default MuiWrappedApp

MuiWrappedApp.propTypes = {
  children: PropTypes.any,
  isChangedTheme: PropTypes.bool
}

MuiWrappedApp.displayName = 'MuiWrappedApp'

function MuiWrappedApp(props) {
  const { isChangedTheme } = useSelector((state) => state.viewSettings)
  const { children } = props
  const theme = createMuiTheme(isChangedTheme ? darkTheme : lightTheme)
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children ? children : <App {...props} />}
    </ThemeProvider>
  )
}
