import React, { useState } from 'react'
import PropTypes from 'prop-types'
import DriverExpansionPanel from '../components/DriverExpansionPanel'
import MidiDriverTable from '../components/MidiDriverTable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as MidiSliderActions } from '../actions/slider-list.js'
import { Actions as ViewStuff } from '../actions/view-settings.js'
import { thunkLiveModeToggle } from '../actions/thunks/thunk-live-mode-toggle'

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MidiDriversSettingsPage)

MidiDriversSettingsPage.propTypes = {
  actions: PropTypes.object,
  midi: PropTypes.object,
  viewSettings: PropTypes.object,
  thunkLiveModeToggle: PropTypes.func
}

function MidiDriversSettingsPage(props) {
  const {
    actions,
    midi: {
      midiAccess: { inputs, outputs } = { inputs: [], outputs: [] }
    } = {},
    viewSettings: {
      availableDrivers: { inputs: availableInputs, outputs: avalableOutputs }
    }
  } = props

  const [isFirstPanelExpanded, setIsFirstPanelExpanded] = useState(true)
  const [isScndPanelExpanded, setIsScndPanelExpanded] = useState(true)

  if (!Array.isArray(outputs) || !inputs) return <div></div>


  return (
    <React.Fragment>
      <DriverExpansionPanel
        label='Output MIDI Driver'
        expanded={isScndPanelExpanded}
        noPadding={true}
        onChange={(e) => setIsScndPanelExpanded(!isScndPanelExpanded)}
      >
        {outputs &&
          outputs.map((name, idx) => {
            const { ccChannels, noteChannels } = avalableOutputs[name] || {
              ccChannels: [],
              noteChannels: []
            }
            const isNotEmpty =
              (ccChannels && ccChannels.length > 0) ||
              (noteChannels && noteChannels.length > 0)
            return (
              <DriverExpansionPanel
                key={`output-midi-${idx}`}
                label={name}
                isEmpty={!isNotEmpty}
                noPadding={true}
              >
                <MidiDriverTable
                  labelPostfix='Out'
                  idx={idx}
                  available={avalableOutputs}
                  name={name}
                  handleCheckboxClickNote={handleCheckboxClickNoteOut.bind(
                    this,
                    actions
                  )}
                  handleCheckboxClickCc={handleCheckboxClickCcOut.bind(
                    this,
                    actions
                  )}
                />
              </DriverExpansionPanel>
            )
          })}
      </DriverExpansionPanel>
      <DriverExpansionPanel
        label='Input MIDI Driver'
        expanded={isFirstPanelExpanded}
        noPadding={true}
        onChange={(e) => setIsFirstPanelExpanded(!isFirstPanelExpanded)}
      >
        {inputs &&
          inputs.map((name, idx) => {
            const { ccChannels, noteChannels } = availableInputs[name] || {
              ccChannels: [],
              noteChannels: []
            }
            const isNotEmpty =
              (ccChannels && ccChannels.length > 0) ||
              (noteChannels && noteChannels.length > 0)
            return (
              <DriverExpansionPanel
                key={`input-midi-${idx}`}
                label={name}
                isEmpty={!isNotEmpty}
                noPadding={true}
              >
                <MidiDriverTable
                  labelPostfix='In'
                  idx={idx}
                  available={availableInputs}
                  name={name}
                  handleCheckboxClickNote={handleCheckboxClickNoteIn.bind(
                    this,
                    actions
                  )}
                  handleCheckboxClickCc={handleCheckboxClickCcIn.bind(
                    this,
                    actions
                  )}
                />
              </DriverExpansionPanel>
            )
          })}
      </DriverExpansionPanel>
    </React.Fragment>
  )
}

// function handleChange(panel) {
//   return function(event, expanded) {
//     setState({
//       expanded: expanded ? panel : false
//     })
//   }
// }

function handleCheckboxClickNoteIn(actions, name, isChecked, e) {
  actions.setAvailableDrivers({
    input: {
      name,
      noteChannel: e.target.value,
      isChecked: !isChecked
    }
  })
}
function handleCheckboxClickCcIn(actions, name, isChecked, e) {
  actions.setAvailableDrivers({
    input: {
      name,
      ccChannel: e.target.value,
      isChecked: !isChecked
    }
  })
}
function handleCheckboxClickNoteOut(actions, name, isChecked, e) {
  actions.setAvailableDrivers({
    output: {
      name,
      noteChannel: e.target.value,
      isChecked: !isChecked
    }
  })
}
function handleCheckboxClickCcOut(actions, name, isChecked, e) {
  actions.setAvailableDrivers({
    output: {
      name,
      ccChannel: e.target.value,
      isChecked: !isChecked
    }
  })
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...MidiSliderActions, ...ViewStuff },
      dispatch
    ),
    thunkLiveModeToggle: bindActionCreators(thunkLiveModeToggle, dispatch)
  }
}

function mapStateToProps({ sliders: { sliderList, midi }, viewSettings }) {
  return {
    sliderList,
    midi,
    viewSettings
  }
}
