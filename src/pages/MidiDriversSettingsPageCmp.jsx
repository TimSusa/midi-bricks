import React, { useState } from 'react'
import DriverExpansionPanel from '../components/DriverExpansionPanel'
import MidiDriverTable from '../components/MidiDriverTable'
import { useSelector, useDispatch } from 'react-redux'
import { Actions as MidiSliderActions } from '../global-state/actions/slider-list.js'
import { Actions as ViewStuff } from '../global-state/actions/view-settings.js'

const { setAvailableDrivers } = { ...MidiSliderActions, ...ViewStuff }
export const MidiDriversSettingsPage = MidiDriversSettingsPageComponent

function MidiDriversSettingsPageComponent() {
  const dispatch = useDispatch()
  const { availableDrivers, isMidiFailed } = useSelector(
    (state) => state.viewSettings || {}
  )

  const { inputs: availableInputs, outputs: avalableOutputs } =
    availableDrivers || {}
  const { midiAccess } = useSelector((state) => state.sliders.midi || {})
  const { inputs, outputs } = midiAccess || { inputs: [], outputs: [] }
  const availOut = avalableOutputs || {}
  const availIn = availableInputs || {}
  const [isFirstPanelExpanded, setIsFirstPanelExpanded] = useState(true)
  const [isScndPanelExpanded, setIsScndPanelExpanded] = useState(true)

  if (isMidiFailed) return <div>No Midi Driver available!</div>

  if (!Array.isArray(outputs) || !inputs) return <div></div>
  let isChecked = false
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
            const { ccChannels, noteChannels } = availOut[name] || {
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
                expanded={true}
                noPadding={true}
              >
                <MidiDriverTable
                  labelPostfix='Out'
                  idx={idx}
                  available={availOut}
                  name={name}
                  handleCheckboxClickNote={(cbData) =>
                    handleCheckboxClickNoteOut({ name, cbData })
                  }
                  handleCheckboxClickCc={(cbData) =>
                    handleCheckboxClickCcOut({
                      name,
                      cbData
                    })
                  }
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
            const { ccChannels, noteChannels } = availIn[name] || {
              ccChannels: [],
              noteChannels: []
            }
            const isNotEmpty =
              (ccChannels && ccChannels.length > 0) ||
              (noteChannels && noteChannels.length > 0)
            return (
              <DriverExpansionPanel
                expanded={true}
                key={`input-midi-${idx}`}
                label={name}
                isEmpty={!isNotEmpty}
                noPadding={true}
              >
                <MidiDriverTable
                  labelPostfix='In'
                  idx={idx}
                  available={availIn}
                  name={name}
                  handleCheckboxClickNote={(cbData) =>
                    handleCheckboxClickNoteIn({ name, cbData })
                  }
                  handleCheckboxClickCc={(cbData) =>
                    handleCheckboxClickCcIn({ name, cbData })
                  }
                />
              </DriverExpansionPanel>
            )
          })}
      </DriverExpansionPanel>
    </React.Fragment>
  )
  function handleCheckboxClickNoteIn({ name, cbData }) {
    const { ch } = cbData

    dispatch(
      setAvailableDrivers({
        input: {
          name,
          noteChannel: ch,
          isChecked: !isChecked
        }
      })
    )
  }
  function handleCheckboxClickCcIn({ name, cbData }) {
    const { ch } = cbData

    dispatch(
      setAvailableDrivers({
        input: {
          name,
          ccChannel: ch,
          isChecked: !isChecked
        }
      })
    )
  }
  function handleCheckboxClickNoteOut({ name, cbData }) {
    const { ch } = cbData
    dispatch(
      setAvailableDrivers({
        output: {
          name,
          noteChannel: ch,
          isChecked: !isChecked
        }
      })
    )
  }
  function handleCheckboxClickCcOut({ name, cbData }) {
    const { ch } = cbData

    dispatch(
      setAvailableDrivers({
        output: {
          name,
          ccChannel: ch,
          isChecked: !isChecked
        }
      })
    )
  }
}

// function handleChange(panel) {
//   return function(event, expanded) {
//     setState({
//       expanded: expanded ? panel : false
//     })
//   }
// }
