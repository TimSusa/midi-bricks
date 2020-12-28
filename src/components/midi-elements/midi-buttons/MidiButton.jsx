import React from 'react'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'

MidiButton.propTypes = {
  buttonStyle: PropTypes.object,
  fontColorStyle: PropTypes.object,
  label: PropTypes.string,
  onChangeEnd: PropTypes.func,
  onChangeStart: PropTypes.func
}

function MidiButton(props) {
  const classes = makeStyles(styles)()
  const {
    buttonStyle = {},
    onChangeStart = () => {},
    onChangeEnd = () => {},
    fontColorStyle = {},
    label = ''
  } = props
  return (
    <button
      style={buttonStyle}
      className={classes.root}
      disabled={false}
      onContextMenu={preventCtxMenu}
      onMouseDown={!isTouchDevice() ? onChangeStart : (e) => e.preventDefault()}
      onMouseUp={!isTouchDevice() ? onChangeEnd : (e) => e.preventDefault()}
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
    </button>
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

function styles() {
  return {
    root: {
      margin: 0,
      padding: 0,
      width: 80,
      height: 80,
      textTransform: 'none',
      transition: 'unset',
      border: 'none',
      lineHeight: 1.75,
      borderRadius: 5,
      letterSpacing: '0.02857em',
      outlineStyle: 'none'
    },
    label: {
      width: '100%',
      margin: 0,
      padding: 0,
      fontWeight: 600
    }
  }
}

export default MidiButton
