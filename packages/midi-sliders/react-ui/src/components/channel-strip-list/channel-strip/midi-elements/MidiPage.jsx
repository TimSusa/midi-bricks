import React from 'react'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { STRIP_TYPE } from '../../../../reducers/slider-list.js'

class MidiPage extends React.PureComponent {
  render () {
    const {
      sliderEntry: {
        colors,
        isNoteOn,
        label,
        type,
        i,
        fontSize,
        fontWeight
      },
      classes,
      height,
      width,
      viewSettings
    } = this.props

    // label basic font colors
    const basicFont = viewSettings.isChangedTheme ? 'black' : '#616161' // bad hack go away
    const bbCol = colors && colors.colorFont && colors.colorFont
    const colorFont = bbCol || basicFont

    // label background
    const basicBackground = viewSettings.isChangedTheme ? '#18A49D' : 'white' // bad hack go away
    const sbCol = colors && colors.color && colors.color
    const color = sbCol || basicBackground

    // label activ background
    const sColAct = colors && colors.colorActive && colors.colorActive
    const colorActivated = sColAct || '#FFFF00'
    const labelStyle = {
      height: ((height || 0) - 16),
      width: ((width || 0) - 16),
      background: isNoteOn ? colorActivated : color
    }

    // label active font colors
    const bColAct = colors && colors.colorFontActive && colors.colorFontActive
    const colorFontActive = bColAct || '#BEBEBE'

    // button font size
    const tmpFontSize = (fontSize || 32) + 'px'
    const tmpFontWeight = fontWeight || 500

    const fontColorStyle = {
      color: !isNoteOn ? colorFont : colorFontActive,
      fontSize: tmpFontSize,
      fontWeight: tmpFontWeight
    }

    if (type === STRIP_TYPE.PAGE) {
      return (
        <div
          id={`page-${i}`}
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
              {label}
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

function mapStateToProps ({ viewSettings }) {
  return {
    viewSettings
  }
}

export default (withStyles(styles)(connect(mapStateToProps, null)(MidiPage)))
