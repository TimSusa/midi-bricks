import React, { Component } from 'react'

import Gamepad from 'react-gamepad'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../actions/slider-list.js'

import { Typography } from '@material-ui/core'

class XyPad extends Component {
  state = {
    speedX: 0.0,
    speedY: 0.0,
    x: this.props.x || 0,
    y: this.props.y || 0,
    connected: false,
    pressedButtons: [],
  }

  componentDidMount() {
    window.requestAnimationFrame(this.update.bind(this))
  }

  update(datetime) {
    window.requestAnimationFrame(this.update.bind(this))

    const frameTime = datetime - this.previousFrameTime
    this.previousFrameTime = datetime

    if (isNaN(frameTime)) return

    this.setState({
      x:
        1 +
        (this.state.speedX * this.props.width) / 2 +
        this.props.width / 2 -
        12,
      y:
        1 -
        (this.state.speedY * this.props.height) / 2 +
        this.props.height / 2 -
        16,
    })
  }

  render() {
    const { x, y, pressedButtons } = this.state
    const {
      width,
      height,
      classes,
      sliderEntry: { label },
    } = this.props
    return (
      <React.Fragment>
        {/* <Typography className={classes.label} style={{ marginBottom: -21 }}>
          {label}
        </Typography> */}
        <Gamepad
          gamepadIndex={0}
          onConnect={this.connectHandler}
          onDisconnect={this.disconnectHandler}
          onAxisChange={this.axisChangeHandler}
          onButtonDown={this.onButtonDown}
          onButtonUp={this.onButtonUp}
        >
          <Pad
            x={x}
            y={y}
            getPlayerStyle={this.getPlayerStyle}
            height={height}
            width={width}
            pressedButtons={pressedButtons}
            isConnected={this.state.connected}
            sendOutFromChildren={this.sendOutFromChildren}
          />
        </Gamepad>
      </React.Fragment>
    )
  }

  connectHandler = gamepadIndex => {
    console.log(`Gamepad ${gamepadIndex} connected!`)

    this.setState({
      connected: true,
    })
  }

  disconnectHandler = gamepadIndex => {
    console.log(`Gamepad ${gamepadIndex} disconnected !`)

    this.setState({
      connected: false,
    })
  }

  axisChangeHandler = (axisName, value, previousValue) => {
    if (axisName === 'LeftStickX') {
      this.props.actions.handleSliderChange({
        idx: this.props.idx,
        val: parseInt((value + 1) * 63.5, 10),
      })

      this.setState({
        speedX: value,
      })
    } else if (axisName === 'LeftStickY') {
      this.props.actions.sendMidiCcY({
        idx: this.props.idx,
        yVal: parseInt((value + 1) * 63.5, 10),
      })
      this.setState({
        speedY: value,
      })
    }
  }

  sendOutFromChildren = (x, y) => {
    this.props.actions.handleSliderChange({
      idx: this.props.idx,
      val: parseInt(x, 10),
    })

    this.props.actions.sendMidiCcY({
      idx: this.props.idx,
      yVal: parseInt(y, 10),
    })
  }

  onButtonDown = e => {
    this.setState({ pressedButtons: [...this.state.pressedButtons, e] })
  }

  onButtonUp = e => {
    const idx = this.state.pressedButtons.findIndex(cur => cur === e)
    const list = this.state.pressedButtons.map(cur => cur).splice(idx, 0)
    this.setState({ pressedButtons: list })
  }

  getPlayerStyle = (x, y) => {
    return {
      position: 'relative',
      height: '24px',
      width: '24px',
      borderRadius: '100%',
      background: 'grey',
      color: 'grey',
      top: Math.round(y) + 'px',
      left: Math.round(x) + 'px',
    }
  }
}

// function mapStateToProps({ viewSettings: { isSettingsMode } }) {
//   return {
//     isSettingsMode,
//   }
// }

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch),
  }
}

export default connect(
  null,
  mapDispatchToProps
)(XyPad)

class Pad extends Component {
  selfRef = null
  onPointerMove = null
  constructor(props) {
    super(props)
    this.state = {
      x: 0,
      y: 0,
    }
    this.selfRef = React.createRef()
  }

  render() {
    return (
      <div
        onContextMenu={e => {
          e.preventDefault()
          e.stopPropagation()
          return false
        }}
        ref={ref => (this.selfRef = ref)}
        onPointerDown={this.handlePointerStart}
        onPointerMove={this.onPointerMove}
        onPointerUp={this.handlePointerEnd}
        style={{
          cursor: 'pointer',
          height: this.props.height || 300,
          borderRadius: 3,
          width: this.props.width || 300,
          border: '1px solid grey',
          background:
            this.props.pressedButtons.length > 0
              ? 'pink'
              : this.props.isConnected
              ? 'aliceblue'
              : 'red',
          opacity: 0.7,
        }}
      >
        <div
          style={this.props.getPlayerStyle(
            this.state.x || this.props.x,
            this.state.y || this.props.y,
            this.props.pressedButtons
          )}
        />
        {this.props.pressedButtons}
      </div>
    )
  }

  handlePointerStart = e => {
    console.log('pointer start', e)
    this.onPointerMove = this.handlePointerMove
    this.selfRef.setPointerCapture(e.pointerId)
  }
  handlePointerEnd = e => {
    console.log('pointer end', e)
    this.onPointerMove = null
    this.selfRef.releasePointerCapture(e.pointerId)

    const tmpX = this.props.width / 2
    const tmpXx = tmpX < 0 ? 0 : tmpX
    const x = tmpXx > this.props.width - 0 ? this.props.width - 0 : tmpXx
    const valX = ((this.props.width - x) * 127) / (this.props.width + 0)

    const tmpY = this.props.height / 2
    const tmpYy = tmpY < 0 ? 0 : tmpY
    const y = tmpYy > this.props.height - 0 ? this.props.height - 0 : tmpYy
    const val = ((this.props.height - y) * 127) / (this.props.height + 0)

    console.log('hadlepointermove ', val)
    this.setState({ x, y })
    this.props.sendOutFromChildren(valX, val)
  }
  handlePointerMove = e => {
    const parentRect = this.selfRef.getBoundingClientRect()

    const tmpX = e.clientX - parentRect.x
    const tmpXx = tmpX < 0 ? 0 : tmpX
    const x = tmpXx > this.props.width - 0 ? this.props.width - 0 : tmpXx
    const valX = ((this.props.width - x) * 127) / (this.props.width + 0)

    const tmpY = e.clientY - parentRect.y
    const tmpYy = tmpY < 0 ? 0 : tmpY
    const y = tmpYy > this.props.height - 0 ? this.props.height - 0 : tmpYy
    const val = ((this.props.height - y) * 127) / (this.props.height + 0)

    console.log('hadlepointermove ', val)
    this.setState({ x, y })
    this.props.sendOutFromChildren(valX, val)
  }
}
