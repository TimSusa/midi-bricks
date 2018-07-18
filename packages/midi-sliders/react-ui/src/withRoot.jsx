import { CssBaseline, MuiThemeProvider, createMuiTheme } from '@material-ui/core'
import * as React from 'react'

// A theme with custom primary and secondary color.
// It's optional.
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
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        {/* Reboot kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    )
  }

  return WithRoot
}

export default withRoot
