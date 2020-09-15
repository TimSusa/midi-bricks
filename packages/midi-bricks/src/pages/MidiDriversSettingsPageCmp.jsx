import React, { useState } from 'react'
import PropTypes from 'prop-types'
import DriverExpansionPanel from '../components/DriverExpansionPanel'
import MidiDriverTable from '../components/MidiDriverTable'
import { connect, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as MidiSliderActions } from '../global-state/actions/slider-list.js'
import { Actions as ViewStuff } from '../global-state/actions/view-settings.js'
import { thunkLiveModeToggle } from '../global-state/actions/thunks/thunk-live-mode-toggle'

export const MidiDriversSettingsPage = connect(
  null,
  mapDispatchToProps
)(MidiDriversSettingsPageComponent)

MidiDriversSettingsPageComponent.propTypes = {
  actions: PropTypes.object,
  midi: PropTypes.object,
  viewSettings: PropTypes.object,
  thunkLiveModeToggle: PropTypes.func
}

function MidiDriversSettingsPageComponent(props) {
  const { inputs: availableInputs, outputs: avalableOutputs } = useSelector(
    (state) => state.viewSettings.availableDrivers
  )
  //const sliderList = useSelector((state) => state.sliders.sliderList)
  const { inputs, outputs } = useSelector(
    (state) => state.sliders.midi.midiAccess
  )
  const {
    actions
    //midi: { midiAccess: { inputs, outputs } = { inputs: [], outputs: [] } } = {}
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
        onChange={() => setIsScndPanelExpanded(!isScndPanelExpanded)}
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
        onChange={() => setIsFirstPanelExpanded(!isFirstPanelExpanded)}
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
