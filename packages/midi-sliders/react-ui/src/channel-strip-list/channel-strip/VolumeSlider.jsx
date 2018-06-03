import React, { Component } from 'react'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

export default class VolumeSlider extends Component {
  render () {
    return (
      <Slider
        value={this.props.value}
        orientation='vertical'
        onChange={this.props.onChange}
        min={0}
        max={127}
      />
    )
  }
}
