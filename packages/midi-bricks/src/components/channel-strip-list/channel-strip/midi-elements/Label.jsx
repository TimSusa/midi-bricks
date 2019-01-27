import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {Actions as MidiSliderActions}  from '../../../../actions/slider-list.js'

export const LabelComponent = props => (
  <div
    onClick={() =>
      props.handleSliderChange({
        idx: props.idx,
        val: props.lastSavedVal || 0,
      })
    }
    style={{
      fontWeight: props.fontWeight,
      fontSize: (parseInt(props.fontSize, 10) || 16) + 'px',
      color: props.colorFont,
    }}
    className={props.labelStyle}
  >
    {props.children}
  </div>
)

function mapDispatchToProps(dispatch) {
  return {
    handleSliderChange: bindActionCreators(
      MidiSliderActions.handleSliderChange,
      dispatch
    ),
  }
}

export const Label = connect(
    null,
    mapDispatchToProps
  )(LabelComponent)