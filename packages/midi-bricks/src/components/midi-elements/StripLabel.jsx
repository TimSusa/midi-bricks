import React from 'react'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/styles'
import { useSelector } from 'react-redux'
import { STRIP_TYPE } from '../../global-state/reducers/slider-list.js'

StripLabel.propTypes = {
  height: PropTypes.number,
  idx: PropTypes.number,
  isChangedTheme: PropTypes.bool,
  sliderEntry: PropTypes.object,
  width: PropTypes.number
}

function StripLabel(props) {
  const isChangedTheme = useSelector(
    (state) => state.viewSettings.isChangedTheme
  )
  const theme = useTheme()
  const classes = makeStyles(styles.bind(this, theme))()
  const { idx, height = '', width = '' } = props
  const { isNoteOn, colors, fontSize, fontWeight, type, label } = useSelector(
    (state) => state.sliders.sliderList[idx] || {}
  )
  if (type !== STRIP_TYPE.LABEL) {
    return <div />
  }

  const { labelStyle, fontColorStyle } = getLabelStyles(
    isChangedTheme,
    colors,
    height,
    width,
    isNoteOn,
    fontSize,
    fontWeight
  )

  return (
    <div style={labelStyle} className={classes.labelWrap}>
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
      width: '100%',
      fontWeight: 600,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }
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
  const colorFont = bbCol || basicFont
  // label background
  const basicBackground = isChangedTheme ? '#18A49D' : 'white' // bad hack go away
  const sbCol = colors && colors.color && colors.color
  const color = sbCol || basicBackground
  // label activ background
  const sColAct = colors && colors.colorActive && colors.colorActive
  const colorActivated = sColAct || '#FFFF00'
  const labelStyle = {
    height: (height || 0) - 0,
    width: (width || 0) - 0,
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
  return { labelStyle, fontColorStyle }
}

export default StripLabel
