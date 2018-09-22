import React from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../../actions/slider-list.js'
import { STRIP_TYPE } from '../../../../reducers/slider-list.js'

class MidiButtons extends React.Component {
  state = {
    isCcToggleOn: false
  }
  render () {
    const { sliderEntry, idx, classes, height, width, viewSettings } = this.props

    // button basic font colors
    const basicFont = viewSettings.isChangedTheme ? 'black' : '#616161' // bad hack go away
    const bbColors = sliderEntry.colors
    const bbCol = bbColors && bbColors.colorFont && bbColors.colorFont.hex
    const colorFont = bbCol || basicFont

    // button background
    const basicBackground = viewSettings.isChangedTheme ? '#18A49D' : 'white' // bad hack go away
    const sbColors = sliderEntry.colors
    const sbCol = sbColors && sbColors.color && sbColors.color.hex
    const color = sbCol || basicBackground

    // button activ background
    const sColors = sliderEntry.colors
    const sColAct = sColors && sColors.colorActive && sColors.colorActive.hex
    const colorActivated = sColAct || '#FFFF00'
    const buttonStyle = {
      height: ((height || 0) - 32),
      width: ((width || 0) - 32),
      background: sliderEntry.isNoteOn ? colorActivated : color
    }

    // button active font colors
    const bColors = sliderEntry.colors
    const bColAct = bColors && bColors.colorFontActive && bColors.colorFontActive.hex
    const colorFontActive = bColAct || '#BEBEBE'

    const fontColorStyle = {
      color: !sliderEntry.isNoteOn ? colorFont : colorFontActive,
      fontWeight: 600
    }
    if (sliderEntry.type === STRIP_TYPE.BUTTON) {
      return (
        <div
          className={classNames({
            [classes.root]: true
          })}
        >
          <Button
            disableTouchRipple
            style={buttonStyle}
            onContextMenu={this.preventCtxMenu}
            className={classes.button}
            variant='raised'
            onMouseDown={this.props.actions.toggleNote.bind(this, idx)}
            onMouseUp={this.props.actions.toggleNote.bind(this, idx)}
            onTouchStart={this.handleTouchButtonTrigger.bind(this, idx)}
            onTouchEnd={this.handleTouchButtonTrigger.bind(this, idx)}
          >
            <Typography
              variant='body1'
              style={fontColorStyle}
              className={classes.label}
            >
              {sliderEntry.label}
            </Typography>
          </Button>
        </div>
      )
    } else if (sliderEntry.type === STRIP_TYPE.BUTTON_TOGGLE) {
      return (
        <div
          className={classNames({
            [classes.root]: true

          })}>
          <Button
            disableTouchRipple
            style={buttonStyle}
            onContextMenu={this.preventCtxMenu}
            classes={{ root: classes.button }}
            variant='raised'
            onClick={this.handleTouchButtonTrigger.bind(this, idx)}
          // onTouchStart={this.handleTouchButtonTrigger.bind(this, idx)}
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
    } else if (sliderEntry.type === STRIP_TYPE.BUTTON_CC) {
      return (
        <div
          className={classNames({
            [classes.root]: true

          })}>
          <Button
            disableTouchRipple
            style={buttonStyle}
            onContextMenu={this.preventCtxMenu}
            classes={{ root: classes.button }}
            variant='raised'
            onMouseDown={this.handleButtonCcTriggerOn.bind(this, idx)}
            onMouseUp={this.handleButtonCcTriggerOff.bind(this, idx)}
            onTouchStart={this.handleButtonCcTriggerOn.bind(this, idx)}
            onTouchEnd={this.handleButtonCcTriggerOff.bind(this, idx)}
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
    } else {
      return (<div />)
    }
  }

  // For touch-devices, we do not want
  // context menu being shown on touch events
  preventCtxMenu = (e) => {
    e.preventDefault()
    e.stopPropagation()
    return false
  }

  // Prevent double events, after touch,
  // from being triggered
  handleTouchButtonTrigger = (idx, e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.actions.toggleNote(idx)
  }

  handleButtonCcTriggerOn = (idx, e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.actions.handleSliderChange({ idx, val: 127 })
  }

  handleButtonCcTriggerOff = (idx, e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.actions.handleSliderChange({ idx, val: 0 })
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

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}
function mapStateToProps ({ viewSettings }) {
  return {
    viewSettings
  }
}

export default (withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MidiButtons)))
