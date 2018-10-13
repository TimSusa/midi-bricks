import { withStyles } from '@material-ui/core'
import * as React from 'react'
// import Slider from '../components/channel-strip-list/channel-strip/slider/Slider'
import Button from '@material-ui/core/Button'

class TestPage extends React.PureComponent {
  state = {
    open: false,
    hasMidi: true,
    val1: 50,
    val2: 50,
    val3: true,
    val4: true
  }
  currentTouches = []

  render () {
    const { classes } = this.props
    return (
      <div style={{ display: 'flex' }}>
        <Button
          className={classes.button}
          disableTouchRipple
          onContextMenu={this.preventCtxMenu}
          classes={{ root: classes.button }}
          variant='raised'
          onMouseDown={!this.isTouchDevice() ? this.handleChangeButton1 : (e) => e.preventDefault()}
          // onMouseUp={this.handleChangeButton1}
          onTouchStart={this.handleChangeButton1}
        // onTouchEnd={this.handleChangeButton1}
        >
          1
        </Button>
        <Button
          className={classes.button}
          variant='raised'
          disableTouchRipple
          onContextMenu={this.preventCtxMenu}
          onMouseDown={!this.isTouchDevice() ? this.handleChangeButton2 : (e) => e.preventDefault()}
          // onMouseUp={this.handleChangeButton2}
          onTouchStart={this.handleChangeButton2}
        // onTouchEnd={this.handleChangeButton2}
        >
          2
        </Button>
      </div>)
  }

  isTouchDevice = () => {
    const hasIt = 'ontouchstart' in window || // works on most browsers
    navigator.maxTouchPoints // works on IE10/11 and Surface
    return !!hasIt
  }

  handleTouchStart = (e) => {
    // e.preventDefault()
    this.touchStarted(e)
  }
  handleTouchMove = (e) => {
    // e.preventDefault()
    this.touchMoved(e)
  }
  hanldeTouchEnd = (e) => {
    // e.preventDefault()
    this.touchEnded(e)
  }

  handleChange = (e, val) => {
    this.setState({ val1: val })
    console.log('val1: ', val)
  }

  handleChange2 = (e, val) => {
    this.setState({ val2: val })
    console.log('val2: ', val)
  }

  handleChangeSim = (e) => {
    this.setState({ val1sim: e.target.value })
    console.log('val1sim: ', e.target.value)
  }

  handleChange2Sim = (e) => {
    this.setState({ val2sim: e.target.value })
    console.log('val2sim: ', e.target.value)
  }

  handleChangeButton1 = (e, val) => {
    this.setState({ val3: !this.state.val3 })
    // e.preventDefault()
    console.log('val3: ', this.state.val3)
  }

  handleChangeButton2 = (e, val) => {
    this.setState({ val4: !this.state.val4 })
    // e.preventDefault()
    console.log('val4: ', this.state.val4)
  }
}
const styles = theme => ({

  sliderContainer: {
    width: 120,
    margin: '0 16px 0 16px'
  },
  vertical: {
    left: 0
  },
  activated: {},
  jumped: {
    transition: 'none'
  },
  track: {
    '&$vertical': {
      width: 120,
      border: 'solid 1px rgba(0,0,0,0.1)',
      borderRadius: 2,
      left: 0
    }
  },
  trackBefore: {
    background: theme.palette.secondary.dark,
    '&$activated': {
    }
  },
  trackAfter: {
    background: theme.palette.primary.light,
    '&$activated': {
      background: theme.palette.primary.light
    },
    '&$jumped': {
      background: theme.palette.primary.light
    }
  },
  thumb: {
    width: 120,
    height: 40,
    borderRadius: 2,
    left: 0,
    border: 'solid 1px rgba(0,0,0,0.2)',

    '&$activated': {
      boxShadow: '0 0 3px 3px grey',
      width: 114,
      height: 40,
      background: theme.palette.primary.dark
    },
    '&$jumped': {
      width: 120,
      height: 40
    }
  },
  sliderRoot: {
    width: 120,
    cursor: 'default',

    '&$vertical': {
      margin: 0,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  button: {
    margin: theme.spacing.unit,
    background: theme.palette.secondary.light
  },
  iconColor: {
    color: theme.palette.primary.contrastText,
    cursor: 'pointer'
  },
  labelReadOnly: {
    padding: '6px 0 7px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  input: {
    width: 80,
    margin: theme.spacing.unit,
    color: theme.palette.primary.contrastText, // 'rgba(0, 0, 0, 0.54)',
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em'
  },
  inputInput: {
    padding: 0
  },
  formControl: {
    margin: theme.spacing.unit,
    maxWidth: 140
  },
  labelTop: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    color: theme.palette.primary.contrastText,
    margin: theme.spacing.unit,
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em'
  },
  label: {
    color: theme.palette.primary.contrastText
  },
  select: {
    width: 80,
    color: theme.palette.primary.contrastText,
    lineHeight: '1.375em'
  },
  caption: {
    marginTop: theme.spacing.unit,
    color: theme.palette.primary.contrastText,
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em'
  }
})

export default (withStyles(styles)(TestPage))
