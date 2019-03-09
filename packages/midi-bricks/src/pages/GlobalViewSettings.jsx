import React from 'react'
import DriverExpansionPanel from '../components/DriverExpansionPanel'
import MidiDriverTable from '../components/MidiDriverTable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {Actions as MidiSliderActions} from '../actions/slider-list.js'
import {Actions as ViewStuff}  from '../actions/view-settings.js'
import { initApp } from '../actions/init.js'

class GlobalViewSettings extends React.PureComponent {
  constructor(props) {
    super(props)
    this.props.actions.toggleLiveMode({ isLiveMode: false })
    this.state = {
      isFirstPanelExpanded: true,
      isScndPanelExpanded: true,
    }
  }
  render() {
    const {
      midi: {
        midiAccess: { inputs, outputs } = { inputs: [], outputs: [] },
      } = {},
      viewSettings: {
        availableDrivers: { inputs: availableInputs, outputs: avalableOutputs },
      },
    } = this.props
    const { isScndPanelExpanded } = this.state
    return (
      <React.Fragment>
        <DriverExpansionPanel
          label="View Settings"
          expanded={this.state.isScndPanelExpanded}
          noPadding={true}
          onChange={e =>
            this.setState({
              isScndPanelExpanded: !isScndPanelExpanded,
            })
          }
        >
  me tooo
        </DriverExpansionPanel>

      </React.Fragment>
    )
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    })
  }
  handleCheckboxClickNoteIn = (name, isChecked, e) => {
    this.props.actions.setAvailableDrivers({
      input: {
        name,
        noteChannel: e.target.value,
        isChecked: !isChecked,
      },
    })
  }
  handleCheckboxClickCcIn = (name, isChecked, e) => {
    this.props.actions.setAvailableDrivers({
      input: {
        name,
        ccChannel: e.target.value,
        isChecked: !isChecked,
      },
    })
  }
  handleCheckboxClickNoteOut = (name, isChecked, e) => {
    this.props.actions.setAvailableDrivers({
      output: {
        name,
        noteChannel: e.target.value,
        isChecked: !isChecked,
      },
    })
  }
  handleCheckboxClickCcOut = (name, isChecked, e) => {
    this.props.actions.setAvailableDrivers({
      output: {
        name,
        ccChannel: e.target.value,
        isChecked: !isChecked,
      },
    })
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...MidiSliderActions, ...ViewStuff },
      dispatch
    ),
    initApp: bindActionCreators(initApp, dispatch),
  }
}
function mapStateToProps({
  sliders: { sliderList, midi, sliderListBackup },
  viewSettings,
}) {
  return {
    sliderList,
    midi,
    viewSettings,
    sliderListBackup,
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GlobalViewSettings)
