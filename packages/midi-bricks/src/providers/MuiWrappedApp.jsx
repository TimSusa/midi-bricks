import {
  CssBaseline,
  MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import 'typeface-roboto'
import { darkTheme } from '../themes/dark-theme'
import { lightTheme } from '../themes/light-theme'
import App from '../App'

export default connect(
  mapStateToProps,
  null
)(MuiWrappedApp)

MuiWrappedApp.propTypes = {
  children: PropTypes.any,
  isChangedTheme: PropTypes.bool
}

MuiWrappedApp.displayName = 'MuiWrappedApp'

function MuiWrappedApp(props) {
  const { isChangedTheme = false, children } = props
  const theme = createMuiTheme(isChangedTheme ? darkTheme : lightTheme)
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children ? children : <App {...props} />}
    </MuiThemeProvider>
  )
}

function mapStateToProps({present: { viewSettings: { isChangedTheme }}}) {
  return {
    isChangedTheme
  }
}
