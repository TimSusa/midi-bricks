import React from 'react'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../../actions/slider-list.js'

class MidiSlider extends React.PureComponent {
  static defaultProps = {
    height: 0,
  }
  render() {
    const {
      classes,
      isDisabled,
      isSettingsMode,
      sliderEntry: {
        val,
        lastSavedVal,
        label,
        fontSize,
        fontWeight,
        isValueHidden,
        minVal,
        maxVal,
      },
      idx,
      height,
      width,
    } = this.props

    const tmpLabelHeight = this.fontSizeToHeight(fontSize)
    const tmpH =
      (height || 0) -
      (label ? tmpLabelHeight : 35) -
      (isValueHidden ? tmpLabelHeight : 0)
    const tmpFontSize = (parseInt(fontSize, 10) || 16) + 'px'
    const tmpFontWeight = fontWeight || 500
    return (
      <div
        style={{
          height,
          width,
        }}
      >
        <Typography
          className={classes.labelTop}
          style={{
            fontSize: tmpFontSize,
            fontWeight: tmpFontWeight,
          }}
        >
          {label}
        </Typography>
        <div
          onContextMenu={this.preventCtxMenu}
          className={classes.rangeSliderWrapper}
          style={{
            height: isValueHidden ? 1.4 * tmpLabelHeight + tmpH : tmpH,
            bottom: isValueHidden
              ? -tmpLabelHeight / 2
              : fontSize > 23
              ? fontSize / 4
              : -10,
          }}
        >
          <input
            disabled={isDisabled}
            style={{
              width: isValueHidden ? 1.4 * tmpLabelHeight + tmpH : tmpH,
              bottom: isValueHidden
                ? -tmpLabelHeight / (fontSize > 23 ? 3.6 : 1.7)
                : fontSize > 23
                ? fontSize / 5
                : -10,
            }}
            onChange={this.handleSliderChange.bind(this, idx)}
            type="range"
            max={(maxVal && parseInt(maxVal, 10)) || 127}
            min={(minVal && parseInt(minVal, 10)) || 0}
            step={1}
            value={val}
            className={classes.input}
          />
        </div>
        {!isValueHidden ? (
          <Typography
            onClick={() =>
              isSettingsMode
                ? this.props.actions.handleSliderChange({
                    idx,
                    val: lastSavedVal || 0,
                  })
                : {}
            }
            className={classes.caption}
            style={{
              fontSize: tmpFontSize,
              fontWeight: tmpFontWeight,
              cursor: isSettingsMode ? 'pointer' : 'unset',
            }}
          >
            {`${val}`}
            {isSettingsMode && ` / ${lastSavedVal}`}
          </Typography>
        ) : (
          <React.Fragment />
        )}
      </div>
    )
  }

  handleSliderChange = (idx, e, val) => {
    this.props.actions.handleSliderChange({ idx, val: e.target.value })
  }

  // For touch-devices, we do not want
  // context menu being shown on touch events
  preventCtxMenu = e => {
    e.preventDefault()
    e.stopPropagation()
    return false
  }

  fontSizeToHeight = fontSize => {
    if (fontSize <= 8 && fontSize >= 0) return fontSize * 5
    if (fontSize <= 10 && fontSize >= 8) return fontSize * 4
    if (fontSize <= 13 && fontSize > 10) return fontSize * 4
    if (fontSize <= 18 && fontSize > 13) return fontSize * 3.2
    if (fontSize <= 23 && fontSize > 18) return fontSize * 2.6
    if (fontSize <= 33 && fontSize > 23) return fontSize * 2.9
    if (fontSize <= 45 && fontSize > 33) return fontSize * 2.5
    if (fontSize <= 60 && fontSize > 45) return fontSize * 2.2
    if (fontSize <= 63 && fontSize > 60) return fontSize * 2
    if (fontSize <= 100 && fontSize > 63) return fontSize * 1.8
  }
}

const styles = theme => ({
  labelTop: {
    textAlign: 'center',
    // lineHeight: 1,
    // overflow: 'hidden',
    whiteSpace: 'nowrap',
    // textOverflow: 'ellipsis',
    color: theme.palette.primary.contrastText,
    fontSize: '1rem',
    fontWeight: 600,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  rangeSliderWrapper: {
    appearance: 'none',
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
          background: theme.palette.slider.trackActive,
          boxShadow: '0 0 3px 3px rgb(24, 164, 157)',
        },
      },

      '&::-webkit-slider-thumb': {
        appearance: 'none',
        border: 'none',
        height: 70,
        width: 30,
        background: 'goldenrod',

        '&:active': {
          boxShadow: '0 0 3px 3px rgb(24, 164, 157)',
        },
      },

      '&:focus': {
        outline: 'none',
      },
    },
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
    lineHeight: 1,
  },
})

function mapStateToProps({ viewSettings: { isSettingsMode } }) {
  return {
    isSettingsMode,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch),
  }
}

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MidiSlider)
)
