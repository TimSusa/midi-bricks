import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as MidiSliderActions } from '../../actions/slider-list.js'

import { PropTypes } from 'prop-types'

const noop = () => {}
class MidiSlider extends Component {
  selfRef = null
  onPointerMove = null
  constructor(props) {
    super(props)
    this.selfRef = React.createRef()
    this.state = {
      isActivated: false
    }
  }

  render() {
    const {
      isDisabled,
      height,
      sliderThumbHeight,
      width,
      sliderEntry: {
        colors: { color },
        val,
        maxVal,
        minVal
      }
    } = this.props
    return (
      <div
        onContextMenu={(e) => {
          e.preventDefault()
          e.stopPropagation()
          return false
        }}
        ref={this.selfRef}
        onPointerDown={isDisabled ? noop : this.handlePointerStart}
        onPointerMove={isDisabled ? noop : this.onPointerMove}
        onPointerUp={isDisabled ? noop : this.handlePointerEnd}
        style={{
          height: height + sliderThumbHeight,
          width,
          borderRadius: 3,
          background: color ? color : 'aliceblue',
          boxShadow: this.state.isActivated && '0 0 3px 3px rgb(24, 164, 157)'
          //opacity: 0.7,
        }}
      >
        <div
          style={this.getSliderThumbStyle(
            calcYFromVal({
              val,
              height,
              maxVal,
              minVal
            })
          )}
        />
      </div>
    )
  }

  handlePointerStart = (e) => {
    this.onPointerMove = this.handlePointerMove
    window.requestAnimationFrame(this.onPointerMove)
    this.selfRef.current.setPointerCapture(e.pointerId)

    const val = this.heightToVal(e)
    this.sendOutFromChildren(val)
    this.setState({ isActivated: true })
  }

  handlePointerEnd = (e) => {
    this.onPointerMove = null
    this.selfRef.current.releasePointerCapture(e.pointerId)

    const val = this.heightToVal(e)
    this.sendOutFromChildren(val)
    this.setState({ isActivated: false })
  }

  handlePointerMove = (e) => {
    const val = this.heightToVal(e)
    if (isNaN(val)) return
    this.sendOutFromChildren(val)
  }

  sendOutFromChildren = (y) => {
    this.props.actions.handleSliderChange({
      i: this.props.sliderEntry.i,
      val: parseInt(y, 10),
      lastFocusedPage: this.props.lastFocusedPage
    })
  }

  getSliderThumbStyle = (y) => {
    return {
      position: 'relative',
      cursor: 'pointer',
      height: this.props.sliderThumbHeight,
      width: '100%',
      borderRadius: 3,
      background: this.props.sliderEntry.colors.colorActive
        ? this.props.sliderEntry.colors.colorActive
        : 'goldenrod',
      top: Math.round(y - 1),
      left: 0,
      boxShadow: this.state.isActivated && '0 0 3px 3px rgb(24, 164, 157)'
    }
  }

  heightToVal(e) {
    const parentRect = this.selfRef.current.getBoundingClientRect()
    const tmpY = e.clientY - parentRect.y
    if (isNaN(tmpY)) return
    const thumb = this.props.sliderThumbHeight / 2
    const tmpThumb = tmpY - thumb
    const tmpYy = tmpThumb < 0 ? 0 : tmpThumb
    const y = tmpYy >= this.props.height ? this.props.height : tmpYy
    const val =
      ((this.props.height - Math.round(y)) *
        (this.props.sliderEntry.maxVal - this.props.sliderEntry.minVal)) /
      this.props.height
    if (isNaN(val)) return
    return val
  }
}

MidiSlider.propTypes = {
  actions: PropTypes.object,
  height: PropTypes.any,
  isDisabled: PropTypes.bool,
  lastFocusedPage: PropTypes.string,
  sliderEntry: PropTypes.object,
  sliderThumbHeight: PropTypes.any,
  width: PropTypes.any
}

function mapStateToProps({ viewSettings: { lastFocusedPage } }) {
  return {
    lastFocusedPage
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MidiSlider)

function calcYFromVal({ val, height, maxVal, minVal }) {
  const y = height * (1 - val / (maxVal - minVal))
  return y
}
