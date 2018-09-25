import React from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'

class MidiButton extends React.Component {
  render () {
    const {
      classes,
      buttonStyle,
      onChangeStart = () => {},
      onChangeEnd = () => {},
      fontColorStyle,
      label,
      idx
    } = this.props
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
          onMouseDown={!this.isTouchDevice() ? onChangeStart.bind(this, idx) : (e) => e.preventDefault()}
          onMouseUp={!this.isTouchDevice() ? onChangeEnd.bind(this, idx) : (e) => e.preventDefault()}
          onTouchStart={onChangeStart.bind(this, idx)}
          onTouchEnd={onChangeEnd.bind(this, idx)}
        >
          <Typography
            variant='body1'
            style={fontColorStyle}
            className={classes.label}
          >
            {label}
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
  iconColor: {
    color: theme.palette.primary.contrastText,
    width: 18,
    margin: 0,
    padding: 0
  },
  button: {
    marginTop: 16,
    marginBottom: 16,
    background: theme.palette.button.background
  }
})

export default (withStyles(styles)(MidiButton))