export const darkTheme = {
  overrides: {
    // MuiTooltip: {
    //   tooltip: {
    //     height: 0
    //   }
    // }
    // MuiTypography: {
    //   root: {
    //     textAlign: 'center',
    //     // overflow: 'hidden',
    //     // whiteSpace: 'nowrap',
    //     // textOverflow: 'ellipsis',
    //     fontWeight: 800,
    //     fontSize: '1rem',
    //     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    //     // lineHeight: '1.375em'
    //   }
    // },
    MuiButton: {
      contained: {
        '&:hover': {
          backgroundColor: '#ffffff',
          '@media (hover: none)': {
            backgroundColor: '#ffffff'
          }
        }
      }
    }
  },
  palette: {
    background: {
      default: 'black'
    },
    secondary: {
      light: '#ffffff',
      main: '#e0e0e0',
      dark: '#aeaeae',
      contrastText: '#ffffff'
    },
    primary: {
      light: '#cfcfcf',
      main: '#9e9e9e', // '#8bc34a',
      dark: '#707070',
      contrastText: '#18A49D'
    },
    appBar: {
      background: 'black'
    },
    slider: {
      trackActive: '#18A49D',
      trackNonactive: '#07554F',
      border: '#737373',
      thump: '#000000',
      thumpBorder: '#4C4C4C'
    },
    button: {
      background: '#18A49D',
      fontColor: 'black'
    }
  }
}
