import {
  CssBaseline,
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core'
import React from 'react'
import { connect } from 'react-redux'
import 'typeface-roboto'
import { darkTheme } from '../themes/dark-theme'
import { lightTheme } from '../themes/light-theme'
import App from '../App'

console.log('hey my funny test vol 2')

const MuiWrappedApp = props => {
  const { isChangedTheme, children } = props
  const theme = createMuiTheme(isChangedTheme ? darkTheme : lightTheme)
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children ? children : <App {...props} />}
    </MuiThemeProvider>
  )
}

function mapStateToProps({ viewSettings: { isChangedTheme } }) {
  return {
    isChangedTheme,
  }
}

export default connect(
  mapStateToProps,
  null
)(MuiWrappedApp)
