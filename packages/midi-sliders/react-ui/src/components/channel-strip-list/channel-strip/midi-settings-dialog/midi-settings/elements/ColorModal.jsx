import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../../../../actions/slider-list.js'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import Tooltip from '@material-ui/core/Tooltip'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import ColorizeIcon from '@material-ui/icons/Colorize'
import Typography from '@material-ui/core/Typography'
import { SketchPicker } from 'react-color'

import { debounce } from 'lodash'

const DEF_VAL = {
  rgb: {
    a: 0.76,
    b: 51,
    g: 51,
    r: 51
  }
}

class ColorModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      color: this.convertRgba(this.props.color) || DEF_VAL
    }
  }

  render () {
    const { classes, sliderEntry, title = '' } = this.props
    return (
      <div>

        <Tooltip title={'Change Color: ' + title} >
          <Button
            className={classes.button}
            variant='raised'
            onClick={this.handleClickOpen}
          >
            <ColorizeIcon className={classes.iconColor} />
            <Typography
              variant='caption'
            >
              {' Colorize: ' + title}
            </Typography>
          </Button>
        </Tooltip>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle
            color='secondary'
            id='alert-dialog-title'>
            {'Button: ' + sliderEntry.label}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id='alert-dialog-description'
              color='secondary'
            >
              Please choose  your color.
            </DialogContentText>
            <SketchPicker
              color={this.state.color.rgb}
              onChange={this.handleColorChange.bind(this, sliderEntry.i)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleCloseCancel}
              color='primary'
            >
              Cancel
            </Button>
            <Button
              onClick={this.handleClose.bind(this, sliderEntry)}
              color='primary'
              autoFocus
            >
              Change Color
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }

  // In order to avoid performance spikes,
  // debounce
  handleColorChange = debounce((i, c) => {
    this.setState({ color: c })

    // Change output into a format,
    // which directly can be used as css style for color
    const rgba = `rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, ${c.rgb.a})`
    this.props.actions.changeColors({
      i,
      [this.props.fieldName]: rgba
    })
  }, 50)

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleCloseCancel = (e) => {
    this.setState({ open: false })
    e.preventDefault()
  }

  handleClose = (sliderEntry, e) => {
    this.setState({ open: false })
    this.props.onClose && this.props.onClose()
  }

  // Since the color picker is using an object as
  // rgba input, we have to parste the rgba(1,1,1,1) string
  // to that silly format
  convertRgba = (rgba) => {
    const convStrToArray =
      rgba => rgba
        .substr(5, (rgba.length - 6))
        .split(', ')
        .map(item => parseInt(item, 10))

    const convert = rgba => {
      const array = convStrToArray(rgba)
      return {
        rgb: {
          a: array[3],
          b: array[2],
          g: array[1],
          r: array[0]
        }
      }
    }
    let tmpVal = typeof rgba === 'string' ? convert(rgba) : DEF_VAL
    return tmpVal
  }
}

const styles = theme => ({
  button: {
    margin: '8px 0 8px 0',
    width: '100%',
    background: theme.palette.button.background
  },
  iconColor: {
    color: theme.palette.primary.contrastText,
    cursor: 'pointer'
  },
  input: {
    // margin: theme.spacing.unit,
    color: theme.palette.primary.contrastText, // 'rgba(0, 0, 0, 0.54)',
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em'
  },
  inputInput: {
    margin: theme.spacing.unit
  },
  formControl: {
    margin: theme.spacing.unit
  },
  label: {
    color: theme.palette.primary.contrastText
  },
  select: {
    color: theme.palette.primary.contrastText,
    lineHeight: '1.375em'
  }
})

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}

export default (withStyles(styles)(connect(null, mapDispatchToProps)(ColorModal)))
