import { withStyles } from '@material-ui/core'
import * as React from 'react'
import Slider from '@material-ui/lab/Slider'
// import Slider from '../components/channel-strip-list/channel-strip/slider/Slider'
import Button from '@material-ui/core/Button'

class TestPage extends React.Component {
  state = {
    open: false,
    hasMidi: true,
    val1: 50,
    val2: 50,
    val3: true,
    val4: true
  }
  currentTouches = []
  render () {
    const { classes } = this.props

    return (
      <div style={{ display: 'flex' }}>
        <Button
          className={classes.button}
          variant='raised'
          onMouseDown={this.handleChangeButton1}
          onMouseUp={this.handleChangeButton1}
          onTouchStart={this.handleChangeButton1}
          onTouchEnd={this.handleChangeButton1}
        >
          1
        </Button>
        <Button
          className={classes.button}
          variant='raised'
          onMouseDown={this.handleChangeButton2}
          onMouseUp={this.handleChangeButton2}
          onTouchStart={this.handleChangeButton2}
          onTouchEnd={this.handleChangeButton2}
        >
          2
        </Button>
        {/* <Slider
          id={'0'}
          classes={{
            root: classes.sliderRoot,
            vertical: classes.vertical,
            activated: classes.activated,
            jumped: classes.jumped,
            track: classes.track,
            trackBefore: classes.trackBefore,
            trackAfter: classes.trackAfter,
            thumb: classes.thumb
          }}
          style={{ height: 'calc(100vh - 88px - 120px)' }}
          vertical
          reverse
          value={this.state.val1 || 0}
          onChange={this.handleChange}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
          onTouchCancel={this.handleTouchEnd}
          max={127}
          min={0}
          step={1}
        /> */}
        {/* <Slider
          id={'1'}
          classes={{
            root: classes.sliderRoot,
            vertical: classes.vertical,
            activated: classes.activated,
            jumped: classes.jumped,
            track: classes.track,
            trackBefore: classes.trackBefore,
            trackAfter: classes.trackAfter,
            thumb: classes.thumb
          }}
          style={{ height: 'calc(100vh - 88px - 120px)' }}
          vertical
          reverse
          value={this.state.val2 || 0}
          onChange={this.handleChange2}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
          onTouchCancel={this.handleTouchEnd}
          max={127}
          min={0}
          step={1}
        /> */}
        <input
          onChange={this.handleChangeSim}
          type='range'
          min='0'
          max='100'
          value={this.state.val1sim}
        />
        <input
          onChange={this.handleChange2Sim}
          type='range'
          min='0'
          max='100'
          value={this.state.val2sim}
        />
      </div>)
  }

  handleTouchStart = (e) => {
    // e.preventDefault()
    this.touchStarted(e)
  }
  handleTouchMove = (e) => {
    // e.preventDefault()
    this.touchMoved(e)
  }
  hanldeTouchEnd = (e) => {
    // e.preventDefault()
    this.touchEnded(e)
  }

  handleChange = (e, val) => {
    this.setState({ val1: val })
    console.log('val1: ', val)
  }

  handleChange2 = (e, val) => {
    this.setState({ val2: val })
    console.log('val2: ', val)
  }

  handleChangeSim = (e) => {
    this.setState({ val1sim: e.target.value })
    console.log('val1sim: ', e.target.value)
  }

  handleChange2Sim = (e) => {
    this.setState({ val2sim: e.target.value })
    console.log('val2sim: ', e.target.value)
  }

  handleChangeButton1 = (e, val) => {
    this.setState({ val3: !this.state.val3 })
    e.preventDefault()
    console.log('val3: ', this.state.val3)
  }

  handleChangeButton2 = (e, val) => {
    this.setState({ val4: !this.state.val4 })
    e.preventDefault()
    console.log('val4: ', this.state.val4)
  }
  touchStarted = (event) => {
    console.log('idx, event: ', event)
    // event.preventDefault()
    var touches = event.touches

    for (var i = 0; i < touches.length; i++) {
      var touch = touches[i]
      // var touchColor = randomColor()
      console.log('touchStarted: ', touch.target.id || 0)
      this.currentTouches.push({
        ...touch,
        id: touch.target.id,
        // pageX: touch.pageX,
        pageY: touch.pageY
        // color: touchColor
      })
      // this.props.actions.handleSliderChange({idx, val: sliderEntry.val })
      // this.createAndDispatchMouseEvent(touch)
      // ctx.beginPath();
      // ctx.arc(touch.pageX, touch.pageY, 2.5, Math.PI*2, false);
      // ctx.fillStyle = touchColor;
      // ctx.fill();
    }
  }

  touchMoved = (event) => {
    // event.preventDefault()
    var touches = event.touches
    console.log('toch moved ', event)
    for (var i = 0; i < touches.length; i++) {
      var touch = touches[i]
      var currentTouchIndex = this.findCurrentTouchIndex(touch.target.id)
      if (currentTouchIndex >= 0) {
        var currentTouch = this.currentTouches[currentTouchIndex]
        console.log('found toch moved ', currentTouch)
        // this.createAndDispatchMouseEvent(touch)
        // if (currentTouchIndex === 0) {
        //   this.handleChange(currentTouch, )
        // }
        //  ctx.beginPath()
        //  ctx.moveTo(currentTouch.pageX, currentTouch.pageY)
        //  ctx.lineTo(touch.pageX, touch.pageY)
        //  ctx.lineWidth = 4
        //  ctx.strokeStyle = currentTouch.color
        //  ctx.stroke()

        // Update the touch record.
        // currentTouch.pageX = touch.pageX
        const delta = currentTouch.pageY - touch.pageY
        if (delta > 0) {
          console.log('increase ', currentTouch.id)
          this.setState({ val1: this.state.val1 + 2 })

          // this.props.actions.handleSliderChange({idx, val: 3 + sliderEntry.val })
        }
        if (delta < 0) {
          console.log('decrease ', currentTouch.id)
          this.setState({ val1: this.state.val1 - 2 })

          // this.props.actions.handleSliderChange({idx, val: sliderEntry.val - 3 })
        }
        // console.log(currentTouch.pageY - touch.pageY)
        currentTouch.pageY = touch.pageY

        // Store the record.
        this.currentTouches.splice(currentTouchIndex, 1, currentTouch)
      } else {
        console.log('Touch was not found!')
      }
    }
  }

  touchEnded = (event) => {
    // event.preventDefault()
    var touches = event.touches

    for (var i = 0; i < touches.length; i++) {
      var touch = touches[i]
      var currentTouchIndex = this.findCurrentTouchIndex(touch.target.id)

      if (currentTouchIndex >= 0) {
        var currentTouch = this.currentTouches[currentTouchIndex]

        // ctx.beginPath();
        // ctx.moveTo(currentTouch.pageX, currentTouch.pageY);
        // ctx.lineTo(touch.pageX, touch.pageY);
        // ctx.lineWidth = 4;
        // ctx.strokeStyle = currentTouch.color;
        // ctx.stroke();

        // Remove the record.
        this.currentTouches.splice(currentTouchIndex, 1)
      } else {
        console.log('Touch was not found!')
      }
    }
  }

  touchCancel = (idx, event) => {
    event.preventDefault()
    var touches = event.changedTouches

    for (var i = 0; i < touches.length; i++) {
      var currentTouchIndex = this.findCurrentTouchIndex(touches[i].id)

      if (currentTouchIndex >= 0) {
        // Remove the touch record.
        this.currentTouches.splice(currentTouchIndex, 1)
      } else {
        console.log('Touch was not found!')
      }
    }
  }

  // Finds the array index of a touch in the currentTouches array.
  findCurrentTouchIndex = (id) => {
    if (!this.currentTouches) return -1

    for (var i = 0; i < this.currentTouches.length; i++) {
      if (this.currentTouches[i].id === id) {
        return i
      }
    }

    // Touch not found! Return -1.
    return -1
  }
  touchToMouseEvent = (e) => {
    [...e.changedTouches].forEach((touch) => {
      // console.log(touch)
      this.createAndDispatchMouseEvent(touch)
    })
  }

  createAndDispatchMouseEvent = (touch) => {
    const evt = new window.MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: false,
      clientX: touch.clientX,
      clientY: touch.clientY,
      screenX: touch.screenX,
      screenY: touch.screenY,
      relatedTarget: touch.target
    })

    // This gives a huge performance hit
    window.requestAnimationFrame(() => {
      touch.target.dispatchEvent(evt)
      evt.preventDefault()
    })
  }
}
const styles = theme => ({

  sliderContainer: {
    width: 120,
    margin: '0 16px 0 16px'
  },
  vertical: {
    left: 0
  },
  activated: {},
  jumped: {
    transition: 'none'
  },
  track: {
    '&$vertical': {
      width: 120,
      border: 'solid 1px rgba(0,0,0,0.1)',
      borderRadius: 2,
      left: 0
    }
  },
  trackBefore: {
    background: theme.palette.secondary.dark,
    '&$activated': {
    }
  },
  trackAfter: {
    background: theme.palette.primary.light,
    '&$activated': {
      background: theme.palette.primary.light
    },
    '&$jumped': {
      background: theme.palette.primary.light
    }
  },
  thumb: {
    width: 120,
    height: 40,
    borderRadius: 2,
    left: 0,
    border: 'solid 1px rgba(0,0,0,0.2)',

    '&$activated': {
      boxShadow: '0 0 3px 3px grey',
      width: 114,
      height: 40,
      background: theme.palette.primary.dark
    },
    '&$jumped': {
      width: 120,
      height: 40
    }
  },
  sliderRoot: {
    width: 120,
    cursor: 'default',

    '&$vertical': {
      margin: 0,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  button: {
    margin: theme.spacing.unit,
    background: theme.palette.secondary.light
  },
  iconColor: {
    color: theme.palette.primary.contrastText,
    cursor: 'pointer'
  },
  labelReadOnly: {
    padding: '6px 0 7px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  input: {
    width: 80,
    margin: theme.spacing.unit,
    color: theme.palette.primary.contrastText, // 'rgba(0, 0, 0, 0.54)',
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em'
  },
  inputInput: {
    padding: 0
  },
  formControl: {
    margin: theme.spacing.unit,
    maxWidth: 140
  },
  labelTop: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    color: theme.palette.primary.contrastText,
    margin: theme.spacing.unit,
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em'
  },
  label: {
    color: theme.palette.primary.contrastText
  },
  select: {
    width: 80,
    color: theme.palette.primary.contrastText,
    lineHeight: '1.375em'
  },
  caption: {
    marginTop: theme.spacing.unit,
    color: theme.palette.primary.contrastText,
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em'
  }
})

export default (withStyles(styles)(TestPage))
