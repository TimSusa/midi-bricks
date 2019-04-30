import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import DriverExpansionPanel from '../components/DriverExpansionPanel'
import MidiDriverTable from '../components/MidiDriverTable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as MidiSliderActions } from '../actions/slider-list.js'
import { Actions as ViewStuff } from '../actions/view-settings.js'

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MidiDriversSettingsPage)

MidiDriversSettingsPage.propTypes = {
  actions: PropTypes.any,
  midi: PropTypes.object,
  viewSettings: PropTypes.object
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

  useEffect(() => {
    actions.toggleLiveMode({ isLiveMode: false })
  }, [actions])

  const [isFirstPanelExpanded, setIsFirstPanelExpanded] = useState(true)
  const [isScndPanelExpanded, setIsScndPanelExpanded] = useState(true)
  
  return (
    <React.Fragment>
      <DriverExpansionPanel
        label='Output MIDI Driver'
        expanded={isScndPanelExpanded}
        noPadding={true}
        onChange={(e) => setIsScndPanelExpanded(!isScndPanelExpanded)}
      >
        {outputs.map((output, idx) => {
          const { ccChannels, noteChannels } = avalableOutputs[output.name] || {
            ccChannels: [],
            noteChannels: []
          }
          const isNotEmpty =
            (ccChannels && ccChannels.length > 0) ||
            (noteChannels && noteChannels.length > 0)
          return (
            <DriverExpansionPanel
              key={`output-midi-${idx}`}
              label={output.name}
              isEmpty={!isNotEmpty}
              noPadding={true}
            >
              <MidiDriverTable
                labelPostfix='Out'
                idx={idx}
                available={avalableOutputs}
                name={output.name}
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
        {inputs.map((input, idx) => {
          const { ccChannels, noteChannels } = availableInputs[input.name] || {
            ccChannels: [],
            noteChannels: []
          }
          const isNotEmpty =
            (ccChannels && ccChannels.length > 0) ||
            (noteChannels && noteChannels.length > 0)
          return (
            <DriverExpansionPanel
              key={`input-midi-${idx}`}
              label={input.name}
              isEmpty={!isNotEmpty}
              noPadding={true}
            >
              <MidiDriverTable
                labelPostfix='In'
                idx={idx}
                available={availableInputs}
                name={input.name}
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

function handleCheckboxClickNoteIn(name, isChecked, actions, e) {
  actions.setAvailableDrivers({
    input: {
      name,
      noteChannel: e.target.value,
      isChecked: !isChecked
    }
  })
}
function handleCheckboxClickCcIn(name, isChecked, actions, e) {
  actions.setAvailableDrivers({
    input: {
      name,
      ccChannel: e.target.value,
      isChecked: !isChecked
    }
  })
}
function handleCheckboxClickNoteOut(name, isChecked, actions, e) {
  actions.setAvailableDrivers({
    output: {
      name,
      noteChannel: e.target.value,
      isChecked: !isChecked
    }
  })
}
function handleCheckboxClickCcOut(name, isChecked, actions, e) {
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
    )
  }
}

function mapStateToProps({
  sliders: { sliderList, midi, sliderListBackup },
  viewSettings
}) {
  return {
    sliderList,
    midi,
    viewSettings,
    sliderListBackup
  }
}