export const lightTheme = {
  typography: {
    useNextVariants: true
  },
  overrides: {
    // MuiTooltip: {
    //   tooltip: {
    //     height: 0
    //   }
    // }
    MuiButton: {
      contained: {
        '&:hover': {
          backgroundColor: '#ffffff',
          '@media (hover: none)': {
            backgroundColor: '#ffffff'
          }
        }
      }
    },
    MuiTableCell: {
      root: {
        padding: '4px 8px 4px 24px'
      }
    }
  },
  palette: {
    secondary: {
      light: '#cfcfcf',
      main: '#707070', // '#8bc34a',
      dark: '#aeaeae',
      contrastText: '#616161'
    },
    primary: {
      light: '#cfcfcf',
      main: '#e0e0e0', // '#8bc34a',
      dark: '#707070',
      contrastText: '#455a64'
    },
    appBar: {
      background: '#cfcfcf'
    },
    slider: {
      trackActive: '#cfcfcf',
      trackNonactive: '#cfcfcf',
      border: '#737373',
      thump: '#bbbbb7',
      thumpBorder: '#757575'
    },
    button: {
      background: '#ffffff',
      fontColor: '#616161'
    }
  }
}
