import React from 'react'
import ChannelStrip from './channel-strip/ChannelStrip'
import * as MidiSliderActions from '../../actions/midi-sliders.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withStyles } from '@material-ui/core/styles'

class ChannelStripList extends React.Component {
  render () {
    return (
      <div>
        <div className={this.props.classes.channelList}>
          {this.renderChannelStrips()}
        </div>
      </div>

    )
  }

  renderChannelStrips = () => {
    const entries = this.props.sliderList

    return entries && entries.map((sliderEntry, idx) => {
      const data = { availableDrivers: this.props.midiDrivers, sliderEntry, idx }
      return (
        <ChannelStrip
          key={`slider-${idx}`}
          data={data}
          {...this.getMethodProps()}
        />

      )
    })
  }

  getMethodProps = () => ({
    handleNoteToggle: this.props.actions.toggleNote,
    handleNoteTrigger: this.props.actions.triggerNote,
    handleInputLabel: this.handleInputLabel,
    handleDriverSelectionChange: this.handleDriverSelectionChange,
    handleRemoveClick: this.props.actions.deleteSlider,
    handleCcChange: this.handleCcChange,
    handleMidiChannelChange: this.handleMidiChannelChange,
    handleSliderChange: this.handleSliderChange,
    handleExpanded: this.props.actions.expandSlider
  })

  handleInputLabel = (idx, e) => {
    this.props.actions.changeSliderLabel({
      idx,
      val: e.target.value
    })
  }

  handleDriverSelectionChange = (idx, e) => {
    this.props.actions.selectSliderMidiDriver({
      idx,
      val: e.target.value
    })
  }

  handleCcChange = (idx, e) => {
    this.props.actions.selectCC({idx, val: e.target.value})
  }

  handleMidiChannelChange = (idx, e) => {
    this.props.actions.selectMidiChannel({idx, val: e.target.value})
  }

  handleSliderChange = (val, idx) => {
    this.props.actions.handleSliderChange({idx, val})
  }

  loadFile = (evt, results) => {
    this.props.actions.loadFile(results)
  }
}

const styles = theme => ({
  channelList: {
    display: 'flex',
    // marginLeft: theme.spacing.unit * 4,
    overflowX: 'scroll'
    // background: theme.palette.primary.main
  }
})

function mapStateToProps (state) {
  return {
    sliderList: state.sliderList,
    midiDrivers: state.midi.midiDrivers
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}

export default (withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ChannelStripList)))
