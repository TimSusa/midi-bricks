import React from 'react'
import { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types'
import keycode from 'keycode'
import classNames from 'classnames'
import withStyles from '@material-ui/core/styles/withStyles'

class CustomVerticalSlider extends React.Component {

  refSlider = React.createRef()
  
  render () {
    return (
      <table className='slider2column'>
      <tbody>
      <tr>
          <td>
            <div className='slidershell' id='slidershell3'>
              <div className='sliderfill' id='sliderfill3' />
              <div className='slidertrack' id='slidertrack3' />
              <div className='sliderthumb' id='sliderthumb3' />
              <div className='slidervalue' id='slidervalue3'>0</div>
              <input 
              ref={this.refSlider}
              className='slidervertical' 
              id='slider3' 
              type='range'
               min={'0'}
               max={'127'} 
               value={this.props.value || '33'}
               onInput={this.handleChangeInput} // {this.showValue(this.props.value,3,true)}
               onChange={this.handleChangeInput} 
               orient='vertical' 
               />
            </div>
          </td>
        </tr>

      </tbody>

      </table>
    )
  }

  handleChangeInput = (e) => {
    console.log('handleChangeInput ', e)
    this.props.onChange(e)
    this.showValue(e.target.value, 3, true)
  }

  /* Code by Steven Estrella. http://www.shearspiremedia.com */
/* we need to change slider appearance oninput and onchange */
 showValue = (val, slidernum, vertical) => {
  /* setup variables for the elements of our slider */
  var thumb = document.getElementById("sliderthumb" + slidernum);
  var shell = document.getElementById("slidershell" + slidernum);
  var track = document.getElementById("slidertrack" + slidernum);
  var fill = document.getElementById("sliderfill" + slidernum);
  var rangevalue = document.getElementById("slidervalue" + slidernum);
  var slider = this.refSlider.current//document.getElementById("slider" + slidernum);
  console.log('showvalue ', slider)
  var pc = val / (slider.max - slider.min); /* the percentage slider value */
  var thumbsize = 40; /* must match the thumb size in your css */
  var bigval = 250; /* widest or tallest value depending on orientation */
  var smallval = 40; /* narrowest or shortest value depending on orientation */
  var tracksize = bigval - thumbsize;
  var fillsize = 16;
  var filloffset = 10;
  var bordersize = 2;
  var loc = vertical ? (1 - pc) * tracksize : pc * tracksize;
  var degrees = 360 * pc;
  var rotation = "rotate(" + degrees + "deg)";

  rangevalue.innerHTML = val;

  thumb.style.webkitTransform = rotation;
  thumb.style.MozTransform = rotation;
  thumb.style.msTransform = rotation;

  fill.style.opacity = pc + 0.2 > 1 ? 1 : pc + 0.2;

  rangevalue.style.top = (vertical ? loc : 0) + "px";
  rangevalue.style.left = (vertical ? 0 : loc) + "px";
  thumb.style.top = (vertical ? loc : 0) + "px";
  thumb.style.left = (vertical ? 0 : loc) + "px";
  fill.style.top = (vertical ? loc + (thumbsize / 2) : filloffset + bordersize) + "px";
  fill.style.left = (vertical ? filloffset + bordersize : 0) + "px";
  fill.style.width = (vertical ? fillsize : loc + (thumbsize / 2)) + "px";
  fill.style.height = (vertical ? bigval - filloffset - fillsize - loc : fillsize) + "px";
  shell.style.height = (vertical ? bigval : smallval) + "px";
  shell.style.width = (vertical ? smallval : bigval) + "px";
  track.style.height = (vertical ? bigval - 4 : fillsize) + "px"; /* adjust for border */
  track.style.width = (vertical ? fillsize : bigval - 4) + "px"; /* adjust for border */
  track.style.left = (vertical ? filloffset + bordersize : 0) + "px";
  track.style.top = (vertical ? 0 : filloffset + bordersize) + "px";
}
/* we often need a function to set the slider values on page load */
//  setValue = (val, num, vertical) => {
// document.getElementById("slider" + num).value = val;
// showValue(val, num, vertical);
// }

// document.addEventListener("DOMContentLoaded", function() {
// setValue(50, 3, true);
// });
}

export default CustomVerticalSlider


