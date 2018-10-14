import { CssBaseline, MuiThemeProvider, createMuiTheme } from '@material-ui/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { darkTheme } from '../themes/dark-theme'
import { lightTheme } from '../themes/light-theme'
import App from '../App'

class MuiWrappedApp extends React.PureComponent {
  render () {
    const theme = createMuiTheme(
      this.props.isChangedTheme ? darkTheme : lightTheme
    )
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <App {...this.props} />
      </MuiThemeProvider>
    )
  }
}

function mapStateToProps ({ viewSettings: { isChangedTheme } }) {
  return {
    isChangedTheme
  }
}

export default (connect(mapStateToProps, null)(MuiWrappedApp))
