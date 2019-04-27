import React from 'react'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { connect } from 'react-redux'
import { STRIP_TYPE } from '../../reducers/slider-list.js'

export default connect(
  mapStateToProps,
  null
)(MidiPage)




MidiPage.propTypes = {
  height: PropTypes.number,
  isChangedTheme: PropTypes.bool,
  width: PropTypes.number
}

function MidiPage(props) {
  const {
    sliderEntry: { colors, isNoteOn, label, type, i, fontSize, fontWeight },
    height,
    width,
    isChangedTheme
  } = props
  const { labelStyle, fontColorStyle } = getLabelStyles(
    isChangedTheme,
    colors,
    height,
    width,
    isNoteOn,
    fontSize,
    fontWeight
  )
  const classes = makeStyles(styles, { withTheme: true })()

  if (type === STRIP_TYPE.PAGE) {
    return (
      <div id={`page-${i}`} style={labelStyle} className={classes.labelWrap}>
        <Typography
          variant='h5'
          align='center'
          style={fontColorStyle}
          className={classes.label}
        >
          {label}
        </Typography>
      </div>
    )
  } else {
    return <div />
  }
}


function styles(theme) {
  return {
    labelWrap: {
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
    }
  }
}

function mapStateToProps({ viewSettings: { isChangedTheme } }) {
  return {
    isChangedTheme
  }
}

function getLabelStyles(
  isChangedTheme,
  colors,
  height,
  width,
  isNoteOn,
  fontSize,
  fontWeight
) {
  const basicFont = isChangedTheme ? 'black' : '#616161' // bad hack go away
  const bbCol = colors && colors.colorFont && colors.colorFont
  const colorFont = bbCol || basicFont // label background
  const basicBackground = isChangedTheme ? '#18A49D' : 'white' // bad hack go away
  const sbCol = colors && colors.color && colors.color
  const color = sbCol || basicBackground // label activ background
  const sColAct = colors && colors.colorActive && colors.colorActive
  const colorActivated = sColAct || '#FFFF00'
  const labelStyle = {
    height: (height || 0) - 0,
    width: (width || 0) - 0,
    background: isNoteOn ? colorActivated : color
  }
  const bColAct = colors && colors.colorFontActive && colors.colorFontActive
  const colorFontActive = bColAct || '#BEBEBE' // button font size
  const tmpFontSize = (fontSize || 32) + 'px'
  const tmpFontWeight = fontWeight || 500
  const fontColorStyle = {
    color: !isNoteOn ? colorFont : colorFontActive,
    fontSize: tmpFontSize,
    fontWeight: tmpFontWeight
  }
  return { labelStyle, fontColorStyle }
}
