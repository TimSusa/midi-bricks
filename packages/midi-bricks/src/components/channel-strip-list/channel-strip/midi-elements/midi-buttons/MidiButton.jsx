import React from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

const MidiButton = props => {
  const {
    classes,
    buttonStyle,
    onChangeStart = () => {},
    onChangeEnd = () => {},
    fontColorStyle,
    label,
    idx,
  } = props
  return (
    <Button
      disableTouchRipple
      disableFocusRipple
      style={buttonStyle}
      onContextMenu={preventCtxMenu}
      classes={{
        root: classes.button,
      }}
      variant="contained"
      onMouseDown={
        !isTouchDevice()
          ? onChangeStart.bind(this, idx)
          : e => e.preventDefault()
      }
      onMouseUp={
        !isTouchDevice() ? onChangeEnd.bind(this, idx) : e => e.preventDefault()
      }
      onTouchStart={onChangeStart.bind(this, idx)}
      onTouchEnd={onChangeEnd.bind(this, idx)}
    >
      <Typography
        variant="body1"
        style={fontColorStyle}
        className={classes.label}
      >
        {label}
      </Typography>
    </Button>
  )
}

// For touch-devices, we do not want
// context menu being shown on touch events
const preventCtxMenu = e => {
  e.preventDefault()
  e.stopPropagation()
  return false
}

const isTouchDevice = () => {
  const hasToch = 'ontouchstart' in window || navigator.maxTouchPoints // works on most browsers // works on IE10/11 and Surface
  return !!hasToch
}

const styles = theme => ({
  label: {
    width: '100%',
    margin: 0,
    padding: 0,
    fontWeight: 600,
  },
  group: {},
  iconColor: {
    color: theme.palette.primary.contrastText,
    width: 18,
    margin: 0,
    padding: 0,
  },
  button: {
    margin: 0,
    padding: 0,
    width: '100%',
    background: theme.palette.button.background,
    textTransform: 'none',
    transition: 'unset',
  },
})

export default withStyles(styles)(MidiButton)
