import React from 'react'
import { WidthProvider, Responsive } from 'react-grid-layout'
import Card from '@material-ui/core/Card'
import ChannelStrip from '../components/channel-strip-list/channel-strip/ChannelStrip'

import _ from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../actions/slider-list.js'

require('react-grid-layout/css/styles.css')
require('react-resizable/css/styles.css')
const ResponsiveReactGridLayout = WidthProvider(Responsive)

/**
 * This layout demonstrates how to use a grid with a dynamic number of elements.
 */
class AddRemoveLayout extends React.PureComponent {
  static defaultProps = {
    className: 'layout',
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 150
  }

  state = {
    laylout: null,
    items: [],
    newCounter: 0
  }

  constructor (props) {
    super(props)

    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({ sysex: true })
        .then(this.onMIDISuccess, this.onMIDIFailure)
    } else {
      window.alert('WebMIDI is not supported in this browser.')
    }

    this.state = {
      laylout: null,

      items: this.props.sliderList.map(function (sliderEntry, idx, list) {
        return {
          sliderEntry,
          idx: idx.toString(),
          x: idx * 2,
          y: 0,
          w: 1,
          h: 2
        }
      }),
      newCounter: 0
    }
  }

  componentWillReceiveProps ({ sliderList }) {
    this.setState({
      items: sliderList.map(function (sliderEntry, idx, list) {
        return {
          sliderEntry,
          idx: idx.toString(),
          x: idx * 2,
          y: 0,
          w: 1,
          h: 2,
          isDraggable: false
        }
      })
    })
  }

  render () {
    return (
      <ResponsiveReactGridLayout
        isDraggable
        compactType='horizontal'
        onLayoutChange={this.onLayoutChange}
        onBreakpointChange={this.onBreakpointChange}
        {...this.props}
      >
        {_.map(this.state.items, el => this.renderElement(el))}
      </ResponsiveReactGridLayout>
    )
  }

  renderElement = (el) => {
    const removeStyle = {
      position: 'absolute',
      right: '2px',
      top: 0,
      cursor: 'pointer'
    }
    const {idx} = el
    return (
      <Card key={idx} data-grid={el} >
        <ChannelStrip sliderEntry={el.sliderEntry} idx={el.idx} />
        <span
          className='remove'
          style={removeStyle}
          onClick={this.onRemoveItem.bind(this, idx)}
        >
          x
        </span>
      </Card>
    )
  }

  // We're using the cols coming back from this to calculate where to add new items.
  onBreakpointChange = (breakpoint, cols) => {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    })
  }

  // here you would trigger to store the layout or persist
  onLayoutChange = (layout) => {
    console.log('layout ', layout)
    // this.props.onLayoutChange(layout)
    this.setState({ layout })
  }

  onRemoveItem = (idx) => {
    this.props.actions.delete(parseInt(idx, 10))
    // this.setState({ items: _.reject(this.state.items, { idx }) }, () => this.props.actions.delete(idx))
  }

  onMIDISuccess = (midiAccess) => {
    if (midiAccess.outputs.size > 0) {
      this.props.actions.initMidiAccess({midiAccess})
    } else {
      this.setState({hasMidi: false})
      console.warn('There are no midi-drivers available. Tip: Please create a virtual midi driver at first and then restart the application.')
    }
  }

  onMIDIFailure = () => {
    window.alert('Could not access your MIDI devices.')
  }
}

function mapStateToProps ({ sliderList, viewSettings }) {
  return {
    sliderList
  }
}
function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddRemoveLayout)
