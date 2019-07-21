import React from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/styles'




MidiButton.propTypes = {
  buttonStyle: PropTypes.object,
  fontColorStyle: PropTypes.object,
  label: PropTypes.string,
  onChangeEnd: PropTypes.func,
  onChangeStart: PropTypes.func,
  isDisabled: PropTypes.bool
}

function MidiButton(props) {
  const theme = useTheme()
  const classes = makeStyles(styles.bind(this, theme))()
  const {
    buttonStyle = {},
    onChangeStart = () => {},
    onChangeEnd = () => {},
    fontColorStyle = {},
    label = '',
    isDisabled
  } = props
  return (
    <Button
      disableTouchRipple
      disableFocusRipple
      style={buttonStyle}
      disabled={isDisabled}
      onContextMenu={preventCtxMenu}
      classes={{
        root: classes.button
      }}
      variant='contained'
      onMouseDown={
        !isTouchDevice()
          ? onChangeStart
          : (e) => e.preventDefault()
      }
      onMouseUp={
        !isTouchDevice()
          ? onChangeEnd
          : (e) => e.preventDefault()
      }
      onTouchStart={onChangeStart}
      onTouchEnd={onChangeEnd}
    >
      <Typography
        variant='body1'
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
function preventCtxMenu(e) {
  e.preventDefault()
  e.stopPropagation()
  return false
}

function isTouchDevice() {
  const hasToch = 'ontouchstart' in window || navigator.maxTouchPoints // works on most browsers // works on IE10/11 and Surface
  return !!hasToch
}

function styles(theme) {
  return {
    label: {
      width: '100%',
      margin: 0,
      padding: 0,
      fontWeight: 600
    },
    group: {},
    iconColor: {
      color: theme.palette.primary.contrastText,
      width: 18,
      margin: 0,
      padding: 0
    },
    button: {
      margin: 0,
      padding: 0,
      width: '100%',
      background: theme.palette.button.background,
      textTransform: 'none',
      transition: 'unset'
    }
  }
}

export default MidiButton
