import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as MidiSliderActions } from '../../actions/slider-list.js'
import { PropTypes } from 'prop-types'

export const Label = connect(
  null,
  mapDispatchToProps
)(LabelComponent)

export function LabelComponent(props) {
  const {
    i,
    lastSavedVal,
    handleSliderChange,
    fontSize,
    fontWeight,
    colorFont,
    labelStyle,
    children
  } = props
  return (
    <div
      onClick={() =>
        handleSliderChange({
          i: i,
          val: lastSavedVal || 0
        })
      }
      style={{
        fontWeight,
        fontSize: (parseInt(fontSize, 10) || 16) + 'px',
        color: colorFont
      }}
      className={labelStyle}
    >
      {children}
    </div>
  )
}

LabelComponent.propTypes = {
  children: PropTypes.any,
  colorFont: PropTypes.string,
  fontSize: PropTypes.any,
  fontWeight: PropTypes.any,
  handleSliderChange: PropTypes.func,
  i: PropTypes.string,
  labelStyle: PropTypes.any,
  lastSavedVal: PropTypes.any
}

function mapDispatchToProps(dispatch) {
  return {
    handleSliderChange: bindActionCreators(
      MidiSliderActions.handleSliderChange,
      dispatch
    )
  }
}
