import { withStyles } from '@material-ui/core'
import * as React from 'react'
import Slider from '@material-ui/lab/Slider'

class TestPage extends React.Component {
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
        <Slider
          id={'0'}
          classes={{
            root: classes.sliderRoot,
            vertical: classes.vertical,
            activated: classes.activated,
            jumped: classes.jumped,
            track: classes.track,
            trackBefore: classes.trackBefore,
            trackAfter: classes.trackAfter,
            thumb: classes.thumb
          }}
          style={{ height: 'calc(100vh - 88px - 120px)' }}
          vertical
          reverse
          value={this.state.val1 || 0}
          onChange={this.handleChange}
          max={127}
          min={0}
          step={1}
        />
        <Slider
          id={'1'}
          classes={{
            root: classes.sliderRoot,
            vertical: classes.vertical,
            activated: classes.activated,
            jumped: classes.jumped,
            track: classes.track,
            trackBefore: classes.trackBefore,
            trackAfter: classes.trackAfter,
            thumb: classes.thumb
          }}
          style={{ height: 'calc(100vh - 88px - 120px)' }}
          vertical
          reverse
          value={this.state.val2 || 0}
          onChange={this.handleChange2}
          min={0}
          step={1}
        />
        <input
          onChange={this.handleChangeSim}
          type='range'
          min='0'
          max='100'
          value={this.state.val1sim}
        />
        <input
          onChange={this.handleChange2Sim}
          type='range'
          min='0'
          max='100'
          value={this.state.val2sim}
        />
      </div>)
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
}
const styles = theme => ({

  sliderContainer: {
    width: 100,
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
      width: 100,
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
    width: 100,
    height: 40,
    borderRadius: 2,
    left: 0,
    border: 'solid 1px rgba(0,0,0,0.2)',

    '&$activated': {
      boxShadow: '0 0 3px 3px grey',
      width: 104,
      height: 40,
      background: theme.palette.primary.dark
    },
    '&$jumped': {
      width: 100,
      height: 40
    }
  },
  sliderRoot: {
    width: 100,
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
