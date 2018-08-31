import React from 'react'
import { WidthProvider, Responsive } from 'react-grid-layout'
import Card from '@material-ui/core/Card'
import ChannelStrip from '../components/channel-strip-list/channel-strip/ChannelStrip'

import _ from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../actions/slider-list.js'
import * as ViewSettingsActions from '../actions/view-settings.js'

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
    sliderList: [],
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
    console.log('fg', this.props.viewSettings)
    this.state = {
      laylout: this.props.viewSettings.listOrder,

      sliderList: this.props.sliderList,
      newCounter: 0
    }
  }

  componentWillReceiveProps ({ sliderList, viewSettings }) {
    console.log('viewSettings ', viewSettings)
    if (this.props.viewSettings !== viewSettings) {
      this.setState({
        layout: viewSettings.listOrder
      })
    }
    this.setState({
      layout: viewSettings.listOrder,
      sliderList
    })
  }

  render () {
    console.log(this.props.viewSettings.isLayoutMode)

    return (
      <ResponsiveReactGridLayout
        isDraggable={this.props.viewSettings.isLayoutMode}
        layout={this.state.layout}
        compactType='horizontal'
        onLayoutChange={this.onLayoutChange}
        onBreakpointChange={this.onBreakpointChange}
        onDragStart={this.handleDragStop}
        onDragStop={this.handleDragStop}
        {...this.props}
      >
        {this.state.sliderList.map((sliderEntry, idx) => this.renderElement(sliderEntry, idx))}
      </ResponsiveReactGridLayout>
    )
  }

  renderElement = (sliderEntry, idx) => {
    const removeStyle = {
      position: 'absolute',
      right: '2px',
      top: 0,
      cursor: 'pointer'
    }
    return (
      <Card key={idx} data-grid={sliderEntry}>
        <ChannelStrip sliderEntry={sliderEntry} idx={idx} />
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

  handleDragStop = (layout, oldItem, newItem, placeholder, e, element) => {
    this.props.actions.changeListOrder({listOrder: layout})
  }
  // We're using the cols coming back from this to calculate where to add new sliderList.
  onBreakpointChange = (breakpoint, cols) => {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    })
  }

  // here you would trigger to store the layout or persist
  onLayoutChange = (layout) => {
    this.props.actions.changeListOrder({listOrder: layout})
    this.setState({ layout })
  }

  onRemoveItem = (idx) => {
    this.props.actions.delete(parseInt(idx, 10))
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
    sliderList,
    viewSettings
  }
}
function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({...MidiSliderActions, ...ViewSettingsActions}, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddRemoveLayout)
