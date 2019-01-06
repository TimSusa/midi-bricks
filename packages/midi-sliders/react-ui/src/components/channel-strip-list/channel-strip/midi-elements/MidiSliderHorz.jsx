import React from 'react'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../../actions/slider-list.js'

class MidiSliderHorz extends React.PureComponent {
  static defaultProps = {
    height: 0,
  }
  render() {
    const {
      isDisabled,
      sliderEntry: {
        val,
        label,
        fontSize,
        fontWeight,
        isValueHidden,
        maxVal,
        minVal,
      },
      idx,
      height,
      width,
    } = this.props
    const { classes } = this.props
    const tmpFontSize = (fontSize || 16) + 'px'
    const tmpFontWeight = fontWeight || 500
    return (
      <div style={{ height, width }} onContextMenu={this.preventCtxMenu}>
        <Typography
          className={classes.labelTop}
          style={{
            fontSize: tmpFontSize,
            fontWeight: tmpFontWeight,
          }}
        >
          {label}
        </Typography>
        <input
          disabled={isDisabled}
          style={{ width }}
          onChange={this.handleSliderChange.bind(this, idx)}
          type="range"
          max={(maxVal && parseInt(maxVal, 10)) || 127}
          min={(minVal && parseInt(minVal, 10)) || 0}
          step={1}
          value={val}
          className={classes.input}
        />
        {!isValueHidden ? (
          <Typography
            className={classes.caption}
            style={{
              fontSize: tmpFontSize,
              fontWeight: tmpFontWeight,
            }}
          >
            {val}
          </Typography>
        ) : (
          <div />
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
}

const styles = theme => ({
  labelTop: {
    textAlign: 'center',

    // overflow: 'hidden',
    whiteSpace: 'nowrap',
    margin: '0 8px',
    textOverflow: 'ellipsis',
    color: theme.palette.primary.contrastText,
    fontSize: '1rem',
    fontWeight: 600,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // lineHeight: '1.375em'
  },
  input: {
    '&[type=range]': {
      appearance: 'none',
      borderRadius: 3,
      margin: 0,
      height: 70,

      '&::-webkit-slider-runnable-track': {
        appearance: 'none',
        background: theme.palette.slider.trackNonactive,
        border: 'none',
        borderRadius: 3,
        cursor: 'pointer',

        // '&:active': {
        //   background: theme.palette.slider.trackActive,
        //   boxShadow: '0 0 3px 3px rgb(24, 164, 157)',
        // },
      },

      '&::-webkit-slider-thumb': {
        appearance: 'none',
        border: 'none',
        height: 70,
        width: 30,
        background: 'goldenrod',

        // '&:active': {
        //   boxShadow: '0 0 3px 3px rgb(24, 164, 157)',
        // },
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
  },
})

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch),
  }
}

export default withStyles(styles)(
  connect(
    null,
    mapDispatchToProps
  )(MidiSliderHorz)
)
