import React from 'react'
import PropTypes from 'prop-types'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { useDispatch } from 'react-redux'
import { Actions as MidiSliderActions } from '../../../global-state/actions/slider-list.js'
import { Actions as ViewActions } from '../../../global-state/actions/view-settings.js'

import { initApp } from '../../../global-state/actions/init.js'
import MidiSuggestedInput from './MidiSuggestedInput'
import {
  renderDriverSelection,
  renderMidiChannelSelection
} from '../MidiSettings'
import { suggestionsMidiCc } from './suggestions'

const { selectMidiDriverInput, selectMidiChannelInput, addMidiCcListener } = {
  ...MidiSliderActions,
  ...ViewActions
}
MidiSettingsInput.propTypes = {
  sliderEntry: PropTypes.object,
  classes: PropTypes.object,
  idx: PropTypes.number,
  initApp: PropTypes.func,
  inputs: PropTypes.object,
  lastFocusedPage: PropTypes.string
}

export default function MidiSettingsInput(props) {
  const dispatch = useDispatch()
  const {
    sliderEntry: { i, type, driverNameInput, midiChannelInput, listenToCc },
    lastFocusedPage,
    inputs,
    classes
  } = props

  return (
    <React.Fragment>
      <FormControl>
        <InputLabel className={classes.label} htmlFor='cc'>
          Listen to CC
        </InputLabel>
        <MidiSuggestedInput
          suggestions={suggestionsMidiCc()}
          startVal={listenToCc || []}
          i={i}
          lastFocusedPage={lastFocusedPage}
          handleChange={handleAddCCListener}
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel className={classes.label} htmlFor='midi-driver'>
          Driver
        </InputLabel>
        <Select
          className={classes.select}
          onChange={(e) =>
            dispatch(
              selectMidiDriverInput({
                i,
                driverNameInput: e.target.value,
                lastFocusedPage
              })
            )
          }
          value={driverNameInput}
        >
          {renderDriverSelection({
            inputs
          })}
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel className={classes.label} htmlFor='input-ch-input'>
          Input Channel
        </InputLabel>
        <Select
          className={classes.select}
          onChange={async (e) => {
            dispatch(
              selectMidiChannelInput({
                i,
                val: e.target.value,
                lastFocusedPage
              })
            )
            await dispatch(initApp())
          }}
          value={`${midiChannelInput}` || 'None'}
        >
          {renderMidiChannelSelection(
            {
              inputs
            },
            driverNameInput,
            type
          )}
        </Select>
      </FormControl>
    </React.Fragment>
  )
  async function handleAddCCListener(e) {
    dispatch(addMidiCcListener(e))
    await dispatch(initApp())
  }
}
