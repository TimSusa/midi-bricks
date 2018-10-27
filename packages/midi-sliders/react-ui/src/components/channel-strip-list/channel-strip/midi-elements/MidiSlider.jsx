import React from 'react'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../../actions/slider-list.js'

class MidiSlider extends React.PureComponent {
  static defaultProps = {
    height: 0
  }
  render () {
    const { sliderEntry: { val, label, fontSize, fontWeight, isValueHidden, minVal, maxVal }, idx, height, width } = this.props
    const { classes } = this.props
    const tmpLabelHeight = (fontSize >= 20) && (fontSize < 65) ? (fontSize * 3.5) : (65)
    const tmpH = (height || 0) - (label ? tmpLabelHeight : 35)
    const tmpFontSize = (fontSize || 16) + 'px'
    const tmpFontWeight = fontWeight || 500

    return (
      <div style={{
        height,
        width
      }}
      >
        <Typography
          className={classes.labelTop}
          style={{
            fontSize: tmpFontSize,
            fontWeight: tmpFontWeight
          }}
        >
          {label}
        </Typography>
        <div
          onContextMenu={this.preventCtxMenu}
          className={classes.rangeSliderWrapper}
          style={{ height: tmpH }}
        >
          <input
            style={{ width: tmpH, bottom: isValueHidden ? (tmpLabelHeight / 6) : 0 }}
            onChange={this.handleSliderChange.bind(this, idx)}
            type='range'
            max={(maxVal && parseInt(maxVal, 10)) || 127}
            min={(minVal && parseInt(minVal, 10)) || 0}
            step={1}
            value={val}
            className={classes.input}
          />
        </div>
        {!isValueHidden ? (
          <Typography
            className={classes.caption}
            style={{
              fontSize: tmpFontSize,
              fontWeight: tmpFontWeight
            }}
          >
            {val}
          </Typography>
        ) : (<React.Fragment />)}
      </div>
    )
  }

  handleSliderChange = (idx, e, val) => {
    this.props.actions.handleSliderChange({ idx, val: e.target.value })
  }

  // For touch-devices, we do not want
  // context menu being shown on touch events
  preventCtxMenu = (e) => {
    e.preventDefault()
    e.stopPropagation()
    return false
  }
}

const styles = theme => ({
  labelTop: {
    textAlign: 'center',

    // overflow: 'hidden',
    whiteSpace: 'nowrap',
    // textOverflow: 'ellipsis',
    color: theme.palette.primary.contrastText,
    fontSize: '1rem',
    fontWeight: 600,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  },
  rangeSliderWrapper: {
    appearance: 'none'
  },

  input: {
    '&[type=range]': {
      appearance: 'none',
      transform: 'rotate(-90deg)',
      transformOrigin: '0 50%',
      position: 'absolute',
      padding: 0,
      margin: 0,
      bottom: 0,
      borderRadius: 3,

      '&::-webkit-slider-runnable-track': {
        appearance: 'none',
        background: theme.palette.slider.trackNonactive,
        border: 'none',
        borderRadius: 3,
        cursor: 'pointer',

        '&:active': {
          background: theme.palette.slider.trackActive
          // boxShadow: '0 0 3px 3px rgb(24, 164, 157)'
        }
      },

      '&::-webkit-slider-thumb': {
        appearance: 'none',
        border: 'none',
        height: 70,
        width: 30,
        background: 'goldenrod',

        '&:active': {
          boxShadow: '0 0 3px 3px rgb(24, 164, 157)'
        }
      },

      '&:focus': {
        outline: 'none'
      }
    }

  },

  caption: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    textAlign: 'center',
    color: theme.palette.primary.contrastText,
    fontSize: '1rem',
    fontWeight: 600,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em'
  }
})

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}

export default (withStyles(styles)(connect(null, mapDispatchToProps)(MidiSlider)))
