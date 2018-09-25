import React from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'

class MidiButtonToggle extends React.Component {
  render () {
    const { classes, buttonStyle, onChange, fontColorStyle, sliderEntry, idx } = this.props
    return (
      <div
        className={classNames({
          [classes.root]: true

        })}>
        <Button
          disableTouchRipple
          disableFocusRipple
          style={buttonStyle}
          onContextMenu={this.preventCtxMenu}
          classes={{ root: classes.button }}
          variant='raised'
          onMouseDown={!this.isTouchDevice() ? onChange.bind(this, idx) : (e) => e.preventDefault()}
          onTouchStart={onChange.bind(this, idx)}
        >
          <Typography
            variant='body1'
            style={fontColorStyle}
            className={classes.label}
          >
            {sliderEntry.label}
          </Typography>
        </Button>
      </div>)
  }

  // For touch-devices, we do not want
  // context menu being shown on touch events
  preventCtxMenu = (e) => {
    e.preventDefault()
    e.stopPropagation()
    return false
  }

  isTouchDevice = () => {
    const hasToch = 'ontouchstart' in window || // works on most browsers
      navigator.maxTouchPoints // works on IE10/11 and Surface
    return !!hasToch
  }
}

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    margin: 0,
    padding: 0,
    fontWeight: 600
  },
  group: {
  },
  button: {
    marginTop: 16,
    marginBottom: 16,
    background: theme.palette.button.background
  }
})

export default (withStyles(styles)(MidiButtonToggle))
