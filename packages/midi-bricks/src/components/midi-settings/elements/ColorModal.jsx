import React, { useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as MidiSliderActions } from '../../../actions/slider-list.js'
import { Actions as ViewSettingsActions } from '../../../actions/view-settings.js'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import Tooltip from '@material-ui/core/Tooltip'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import Typography from '@material-ui/core/Typography'
import { SketchPicker } from 'react-color'

import { debounce } from 'lodash'

export default connect(
  null,
  mapDispatchToProps
)(ColorModal)

const DEF_VAL = {
  rgb: {
    a: 0.76,
    b: 51,
    g: 46,
    r: 0.51
  }
}

const handleColorChange = debounce((onChange, i, actions, fieldName, c) => {
  // Change output into a format,
  // which directly can be used as css style for color
  const rgba = `rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, ${c.rgb.a})`
  const resp = {
    i,
    [fieldName]: rgba
  }
  onChange(resp)
}, 50)

ColorModal.propTypes = {
  actions: PropTypes.any,
  fieldName: PropTypes.any,
  i: PropTypes.string,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  color: PropTypes.string,
  title: PropTypes.string
}

function ColorModal(props) {
  const theme = useTheme()
  const classes = makeStyles(styles.bind(this, theme))()
  let {
    actions,
    fieldName,
    i = '',
    title = '',
    onClose = () => {},
    onChange = () => {}
  } = props

  const [open, setOpen] = useState(false)

  const calcColor = convertRgba(props.color).rgb
  return (
    <div>
      <Tooltip title={'Change Color: ' + title}>
        <Button
          className={classes.button}
          variant='contained'
          onClick={() => setOpen(true)}
        >
          <Typography variant='caption' className={classes.label}>
            {title}
          </Typography>
        </Button>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false)
          onClose && onClose()
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent>
          <DialogContentText
            className={classes.iconColor}
            id='alert-dialog-description'
            color='secondary'
          >
            Please, choose your color.
          </DialogContentText>
          <SketchPicker
            color={calcColor}
            onChange={handleColorChange.bind(
              this,
              onChange,
              i,
              actions,
              fieldName
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button
            className={classes.iconColor}
            onClick={handleClose.bind(this, setOpen, onClose)}
            color='primary'
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

function handleClose(setOpen, onClose) {
  setOpen(false)
  onClose && onClose()
}

// Since the color picker is using an object as
// rgba input, we have to parste the rgba(1,1,1,1) string
// to that silly format
function convertRgba(rgba) {
  const convStrToArray = (rgba) => rgba.substr(5, rgba.length - 6).split(', ')

  const convert = (rgba) => {
    const array = convStrToArray(rgba)
    return {
      rgb: {
        a: parseFloat(array[3]),
        b: parseInt(array[2], 10),
        g: parseInt(array[1], 10),
        r: parseInt(array[0], 10)
      }
    }
  }
  let tmpVal = typeof rgba === 'string' ? convert(rgba) : DEF_VAL
  return tmpVal
}

function styles(theme) {
  return {
    button: {
      margin: '8px 0 8px 0',
      width: '100%',
      background: theme.palette.button.background
    },
    iconColor: {
      color: theme.palette.primary.contrastText,
      cursor: 'pointer'
    },
    label: {
      color: theme.palette.primary.contrastText
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...MidiSliderActions, ...ViewSettingsActions },
      dispatch
    )
  }
}
