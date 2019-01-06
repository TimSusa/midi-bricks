import React, { Component } from 'react'

import Gamepad from 'react-gamepad'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../../actions/slider-list.js'

import { Typography } from '@material-ui/core'

class MidiSlider extends Component {
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
    // const { x, y, pressedButtons } = this.state
    const {
      width,
      height,
      classes,
      sliderEntry: { label, val },
    } = this.props
    return (
      <React.Fragment>
        {/* <Typography style={{position: 'absolute'}}>
        {label} 
        </Typography> */}

        <Pad
          // x={x}
          // y={y}
          val={val}
          getPlayerStyle={this.getPlayerStyle}
          height={height}
          width={width}
          //pressedButtons={pressedButtons}
          isConnected={this.state.connected}
          sendOutFromChildren={this.sendOutFromChildren}
        />
        {/* <Typography
        style={{margin: 0, padding: 0}}
        >
        {val} 
        </Typography> */}
      </React.Fragment>
    )
  }

  sendOutFromChildren = y => {
    this.props.actions.handleSliderChange({
      idx: this.props.idx,
      val: parseInt(y, 10),
    })
  }

  getPlayerStyle = (x, y) => {
    return {
      position: 'relative',
      cursor: 'pointer',
      height: 30,
      width: '100%',
      borderRadius: 3,
      background: 'grey',
      color: 'black',
      top: Math.round(y - 15) < 0 ? 0 : Math.round(y - 15) + 'px',
      left: 0, //Math.round(x) + 'px',
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
)(MidiSlider)

function calcYFromVal(props) {
  const y = -((props.val * props.height) / 127) + props.height
  return y
}

class Pad extends Component {
  selfRef = null
  onPointerMove = null
  constructor(props) {
    super(props)
    this.state = {
      x: 0,
      y: calcYFromVal(this.props),
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
          height: this.props.height || 300,
          width: this.props.width || 300,
          background: 'aliceblue',
          opacity: 0.7,
        }}
      >
        <div
          style={this.props.getPlayerStyle(
            this.state.x,
            this.state.y,
            this.props.pressedButtons
          )}
        >
          <Typography>{this.props.val}</Typography>
        </div>
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
    const parentRect = this.selfRef.getBoundingClientRect()
    this.onPointerMove = null
    this.selfRef.releasePointerCapture(e.pointerId)
    const x = this.props.width / 2
    const tmpY = e.clientY - parentRect.y 
    const tmpYy = tmpY < 0 ? 0 : tmpY
    const y = tmpYy > this.props.height - 0 ? this.props.height - 0 : tmpYy
    this.setState({ x, y })
    const val = ((this.props.height - y) * 127) / (this.props.height + 0)
    this.props.sendOutFromChildren(val)
  }
  handlePointerMove = e => {
    const parentRect = this.selfRef.getBoundingClientRect()
    const x = this.props.width / 2
    const tmpY = e.clientY - parentRect.y 
    const tmpYy = tmpY < 0 ? 0 : tmpY
    const y = tmpYy > this.props.height - 0 ? this.props.height - 0 : tmpYy
    const val = ((this.props.height - y) * 127) / (this.props.height + 0)
    console.log('hadlepointermove ', val)
    this.setState({ x, y })
    this.props.sendOutFromChildren(val)
  }
}

// import React from 'react'
// import Typography from '@material-ui/core/Typography'
// import { withStyles } from '@material-ui/core/styles'
// import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'
// import * as MidiSliderActions from '../../../../actions/slider-list.js'

// class MidiSlider extends React.PureComponent {
//   static defaultProps = {
//     height: 0,
//   }
//   render() {
//     const {
//       classes,
//       isDisabled,
//       isSettingsMode,
//       sliderEntry: {
//         val,
//         lastSavedVal,
//         label,
//         fontSize,
//         fontWeight,
//         isValueHidden,
//         minVal,
//         maxVal,
//       },
//       idx,
//       height,
//       width,
//     } = this.props

//     const tmpLabelHeight = fontSizeToHeight(fontSize)
//     const tmpH =
//       (height || 0) -
//       (label ? tmpLabelHeight : 35) -
//       (isValueHidden ? tmpLabelHeight : 0)
//     const tmpFontSize = (parseInt(fontSize, 10) || 16) + 'px'
//     const tmpFontWeight = fontWeight || 500
//     return (
//       <div
//         style={{
//           height,
//           width,
//         }}
//       >
//         <Typography
//           className={classes.labelTop}
//           style={{
//             fontSize: tmpFontSize,
//             fontWeight: tmpFontWeight,
//           }}
//         >
//           {label}
//         </Typography>
//         <div
//           onContextMenu={preventCtxMenu}
//           className={classes.rangeSliderWrapper}
//         >
//           <input
//             disabled={isDisabled}
//             style={getSliderStyle(
//               isValueHidden,
//               tmpLabelHeight,
//               tmpH,
//               fontSize
//             )}
//             onChange={this.handleSliderChange.bind(this, idx)}
//             type="range"
//             max={(maxVal && parseInt(maxVal, 10)) || 127}
//             min={(minVal && parseInt(minVal, 10)) || 0}
//             step={1}
//             value={val}
//             className={classes.input}
//           />
//         </div>
//         {!isValueHidden ? (
//           <Typography
//             onClick={() =>
//               isSettingsMode
//                 ? this.props.actions.handleSliderChange({
//                     idx,
//                     val: lastSavedVal || 0,
//                   })
//                 : {}
//             }
//             className={classes.caption}
//             style={{
//               fontSize: tmpFontSize,
//               fontWeight: tmpFontWeight,
//               cursor: isSettingsMode ? 'pointer' : 'unset',
//             }}
//           >
//             {val}
//             {isSettingsMode && ` / ${lastSavedVal}`}
//           </Typography>
//         ) : (
//           <React.Fragment />
//         )}
//       </div>
//     )
//   }

//   handleSliderChange = (idx, e, val) => {
//     this.props.actions.handleSliderChange({ idx, val: e.target.value })
//   }
// }
// const preventCtxMenu = e => {
//   e.preventDefault()
//   e.stopPropagation()
//   return false
// }
// const fontSizeToHeight = fontSize => {
//   if (fontSize <= 8 && fontSize >= 0) return fontSize * 5
//   if (fontSize <= 10 && fontSize >= 8) return fontSize * 4
//   if (fontSize <= 13 && fontSize > 10) return fontSize * 4
//   if (fontSize <= 18 && fontSize > 13) return fontSize * 3.2
//   if (fontSize <= 23 && fontSize > 18) return fontSize * 2.6
//   if (fontSize <= 33 && fontSize > 23) return fontSize * 2.9
//   if (fontSize <= 45 && fontSize > 33) return fontSize * 2.5
//   if (fontSize <= 60 && fontSize > 45) return fontSize * 2.2
//   if (fontSize <= 63 && fontSize > 60) return fontSize * 2
//   if (fontSize <= 100 && fontSize > 63) return fontSize * 1.8
// }

// const styles = theme => ({
//   labelTop: {
//     textAlign: 'center',
//     // lineHeight: 1,
//     // overflow: 'hidden',
//     whiteSpace: 'nowrap',
//     // textOverflow: 'ellipsis',
//     color: theme.palette.primary.contrastText,
//     fontSize: '1rem',
//     fontWeight: 600,
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//   },
//   rangeSliderWrapper: {
//     appearance: 'none',
//   },

//   input: {
//     '&[type=range]': {
//       appearance: 'none',
//       transform: 'rotate(-90deg)',
//       transformOrigin: '0 50%',
//       position: 'absolute',
//       padding: 0,
//       margin: 0,
//       bottom: 0,
//       borderRadius: 3,

//       '&::-webkit-slider-runnable-track': {
//         appearance: 'none',
//         background: theme.palette.slider.trackNonactive,
//         border: 'none',
//         borderRadius: 3,
//         cursor: 'pointer',

//         // '&:active': {
//         //   background: theme.palette.slider.trackActive,
//         //   boxShadow: '0 0 3px 3px rgb(24, 164, 157)',
//         // },
//       },

//       '&::-webkit-slider-thumb': {
//         appearance: 'none',
//         border: 'none',
//         height: 70,
//         width: 30,
//         background: 'goldenrod',

//         // '&:active': {
//         //   boxShadow: '0 0 3px 3px rgb(24, 164, 157)',
//         // },
//       },

//       '&:focus': {
//         outline: 'none',
//       },
//     },
//   },

//   caption: {
//     position: 'fixed',
//     bottom: 0,
//     width: '100%',
//     textAlign: 'center',
//     color: theme.palette.primary.contrastText,
//     fontSize: '1rem',
//     fontWeight: 600,
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//     lineHeight: 1,
//   },
// })

// function mapStateToProps({ viewSettings: { isSettingsMode } }) {
//   return {
//     isSettingsMode,
//   }
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     actions: bindActionCreators(MidiSliderActions, dispatch),
//   }
// }

// export default withStyles(styles)(
//   connect(
//     mapStateToProps,
//     mapDispatchToProps
//   )(MidiSlider)
// )

// function getSliderStyle(isValueHidden, tmpLabelHeight, tmpH, fontSize) {
//   return {
//     width: isValueHidden ? 1.4 * tmpLabelHeight + tmpH : tmpH,
//     bottom: isValueHidden
//       ? -tmpLabelHeight / (fontSize > 23 ? 3.6 : 1.7)
//       : fontSize > 23
//       ? fontSize / 5
//       : -10,
//   }
// }
