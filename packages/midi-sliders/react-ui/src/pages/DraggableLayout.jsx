import React from 'react'
import { WidthProvider, Responsive } from 'react-grid-layout'
import Card from '@material-ui/core/Card'
import ChannelStrip from '../components/channel-strip-list/channel-strip/ChannelStrip'
import { SizeMe } from 'react-sizeme'
import _ from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../actions/slider-list.js'
import * as ViewSettingsActions from '../actions/view-settings.js'

require('react-grid-layout/css/styles.css')
require('react-resizable/css/styles.css')
const ResponsiveReactGridLayout = WidthProvider(Responsive)

class DraggableLayout extends React.PureComponent {
  static defaultProps = {
    className: 'layout',
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 150
  }

  constructor (props) {
    super(props)

    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({ sysex: true })
        .then(this.onMIDISuccess, this.onMIDIFailure)
    } else {
      window.alert('WebMIDI is not supported in this browser.')
    }
  }

  render () {
    return (
      <ResponsiveReactGridLayout
        isDraggable={this.props.viewSettings.isLayoutMode}
        isResizable={this.props.viewSettings.isLayoutMode}
        compactType='horizontal'
        onLayoutChange={this.onLayoutChange}
        onBreakpointChange={this.onBreakpointChange}
        onDragStart={this.handleDragStop}
        onDragStop={this.handleDragStop}
        {...this.props}
      >
        {_.map(this.props.sliderList, (sliderEntry, idx) => this.renderElement(sliderEntry, idx))}
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
      <div key={idx} data-grid={sliderEntry} >
        <SizeMe
          monitorHeight
        >
          {({ size }) =>
            <Card style={{height: '100%'}}>
              <ChannelStrip size={size} sliderEntry={sliderEntry} idx={idx} />
              <span
                className='remove'
                style={removeStyle}
                onClick={this.onRemoveItem.bind(this, idx)}
              >
                x
              </span>
            </Card>
          }
        </SizeMe>
      </div>

    )
  }

  // handleDragStop = (layout, oldItem, newItem, placeholder, e, element) => {
  //   console.log('handleDragStop')
  //   this.props.actions.changeListOrder({listOrder: layout})
  // }
  // We're using the cols coming back from this to calculate where to add new sliderList.
  onBreakpointChange = (breakpoint, cols) => {
    this.setState({
      breakpoint,
      cols
    })
  }

  // here you would trigger to store the layout or persist
  onLayoutChange = (layout) => {
    console.log('onLayoutChange ', layout)
    this.props.actions.changeListOrder({ listOrder: layout })
    this.setState({ layout })
  }

  onRemoveItem = (idx) => {
    this.props.actions.delete(parseInt(idx, 10))
  }

  onMIDISuccess = (midiAccess) => {
    if (midiAccess.outputs.size > 0) {
      this.props.actions.initMidiAccess({ midiAccess })
    } else {
      this.setState({ hasMidi: false })
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
    actions: bindActionCreators({ ...MidiSliderActions, ...ViewSettingsActions }, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(DraggableLayout)
