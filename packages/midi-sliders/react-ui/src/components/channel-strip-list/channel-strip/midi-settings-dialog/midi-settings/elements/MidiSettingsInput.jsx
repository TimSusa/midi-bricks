import React from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MidiSuggestedInput from './MidiSuggestedInput'

export const MidiSettingsInput = props => {
  const {
    sliderEntry,
    sliderEntry: {
      i,
      type,
      driverNameInput = 'None',
      midiChannelInput,
      listenToCc,
    },
    idx,
    inputs,
    classes,
    actions,
    handleAddCCListener,
    suggestionsMidiCc,
    renderDriverSelection,
    renderMidiChannelSelection,
  } = props
  return (
    <React.Fragment>
      <FormControl>
        <InputLabel className={classes.label} htmlFor="cc">
          Listen to CC
        </InputLabel>
        <MidiSuggestedInput
          suggestions={suggestionsMidiCc}
          startVal={listenToCc || []}
          sliderEntry={sliderEntry}
          idx={idx}
          handleChange={handleAddCCListener}
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel className={classes.label} htmlFor="midi-driver">
          Driver
        </InputLabel>
        <Select
          className={classes.select}
          onChange={e =>
            actions.selectMidiDriverInput({
              i,
              driverNameInput: e.target.value,
            })
          }
          value={driverNameInput}
        >
          {renderDriverSelection({
            inputs,
          })}
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel className={classes.label} htmlFor="input-ch-input">
          Input Channel{' '}
        </InputLabel>
        <Select
          className={classes.select}
          onChange={e =>
            actions.selectMidiChannelInput({
              idx,
              val: e.target.value,
            })
          }
          value={midiChannelInput || 'None'}
        >
          {renderMidiChannelSelection(
            {
              inputs,
            },
            driverNameInput,
            type
          )}
        </Select>
      </FormControl>
    </React.Fragment>
  )
}
