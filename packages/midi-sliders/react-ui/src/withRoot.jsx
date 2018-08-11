import { CssBaseline, MuiThemeProvider, createMuiTheme } from '@material-ui/core'
import * as React from 'react'

const theme = createMuiTheme({
  // overrides: {
  //   MuiTooltip: {
  //     tooltip: {
  //       height: 0
  //     }
  //   }
  // },
  palette: {
    secondary: {
      light: '#ffffff',
      main: '#e0e0e0',
      dark: '#aeaeae',
      contrastText: '#455a64'
    },
    primary: {
      light: '#cfcfcf',
      main: '#9e9e9e', // '#8bc34a',
      dark: '#707070',
      contrastText: '#616161'
    }
  }
})

function withRoot (Component) {
  function WithRoot (props) {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    )
  }

  return WithRoot
}

export default withRoot
