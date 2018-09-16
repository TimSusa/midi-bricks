import React from 'react'
import Typography from '@material-ui/core/Typography'
// import MusicIcon from '@material-ui/icons/Autorenew'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../actions/slider-list.js'
import { STRIP_TYPE } from '../../../reducers/slider-list'

class StripLabel extends React.Component {
  render () {
    const { sliderEntry, classes, height, width, viewSettings } = this.props

    // label basic font colors
    const basicFont = viewSettings.isChangedTheme ? 'black' : '#616161' // bad hack go away
    const bbColors = sliderEntry.colors
    const bbCol = bbColors && bbColors.colorFont && bbColors.colorFont.hex
    const colorFont = bbCol || basicFont

    // label background
    const basicBackground = viewSettings.isChangedTheme ? '#18A49D' : 'white' // bad hack go away
    const sbColors = sliderEntry.colors
    const sbCol = sbColors && sbColors.color && sbColors.color.hex
    const color = sbCol || basicBackground

    // label activ background
    const sColors = sliderEntry.colors
    const sColAct = sColors && sColors.colorActive && sColors.colorActive.hex
    const colorActivated = sColAct || 'yellow'
    const labelStyle = {
      height: ((height || 0) - 16),
      width: ((width || 0) - 16),
      background: sliderEntry.isNoteOn ? colorActivated : color
    }

    // label active font colors
    const bColors = sliderEntry.colors
    const bColAct = bColors && bColors.colorFontActive && bColors.colorFontActive.hex
    const colorFontActive = bColAct || 'grey'

    const fontColorStyle = {
      color: !sliderEntry.isNoteOn ? colorFont : colorFontActive,
      fontWeight: 600
    }
    if (sliderEntry.type === STRIP_TYPE.LABEL) {
      return (
        <div
          className={classNames({
            [classes.root]: true
          })}
        >
          <div
            style={labelStyle}
            className={classes.labelWrap}
          >
            <Typography
              variant='headline'
              align='center'
              style={fontColorStyle}
              className={classes.label}
            >
              {sliderEntry.label}
            </Typography>
          </div>
        </div>
      )
    } else {
      return (<div />)
    }
  }
}

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    padding: 0
  },
  labelWrap: {
    marginTop: 8,
    borderRadius: 3,
    height: '100%',
    background: theme.palette.button.background
  },
  label: {
    margin: 0,
    padding: 0,
    fontWeight: 600,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  group: {
  },
  iconColor: {
    color: theme.palette.primary.contrastText,
    width: 18,
    margin: 0,
    padding: 0
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

export default (withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(StripLabel)))
