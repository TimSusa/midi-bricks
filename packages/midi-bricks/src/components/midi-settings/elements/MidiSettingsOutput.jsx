import { MinMaxValInput } from './MinMaxValInput'
import React from 'react'
import PropTypes from 'prop-types'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import InputNoteOrCc from './InputNoteOrCc'
import {
  renderDriverSelection,
  renderMidiChannelSelection
} from '../MidiSettings'

import { STRIP_TYPE } from '../../../reducers/slider-list'

const {
  BUTTON,
  BUTTON_CC,
  BUTTON_TOGGLE,
  BUTTON_TOGGLE_CC,
  SLIDER,
  SLIDER_HORZ,
  XYPAD
} = STRIP_TYPE

MidiSettingsOutput.propTypes = {
  sliderEntry: PropTypes.object,
  actions: PropTypes.object,
  classes: PropTypes.object,
  i: PropTypes.string,
  outputs: PropTypes.object,
  lastFocusedPage: PropTypes.string
}

export function MidiSettingsOutput(props) {
  const {
    classes,
    actions,
    sliderEntry: {
      i,
      type,
      minVal,
      maxVal,
      onVal,
      offVal,
      driverName = 'None',
      midiChannel,
      midiCC
    },
    lastFocusedPage,
    outputs
  } = props

  return (
    <React.Fragment>
      <InputNoteOrCc midiCC={midiCC} type={type} i={i} />
      <FormControl className={classes.formControl}>
        <InputLabel className={classes.label} htmlFor='midi-driver'>
          Driver
        </InputLabel>
        <Select
          className={classes.select}
          onChange={(e) =>
            actions.selectMidiDriver({
              i,
              driverName: e.target.value,
              lastFocusedPage
            })
          }
          value={driverName || 'None'}
        >
          {renderDriverSelection({
            outputs
          })}
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel className={classes.label} htmlFor='output-cc-input'>
          Channel
        </InputLabel>
        <Select
          className={classes.select}
          onChange={(e) =>
            actions.selectMidiChannel({
              i,
              val: parseInt(e.target.value, 10),
              lastFocusedPage
            })
          }
          value={midiChannel || 'None'}
        >
          {renderMidiChannelSelection(
            {
              outputs
            },
            driverName,
            type
          )}
        </Select>
      </FormControl>
      {[SLIDER, SLIDER_HORZ, XYPAD].includes(type) && (
        <React.Fragment>
          <MinMaxValInput
            label='Maximum Value'
            value={parseInt(maxVal, 10)}
            name={`input-maxval-name-${i}`}
            limitVal={127}
            onChange={(e) =>
              actions.setMaxVal({
                i,
                val: e.target.value
              })
            }
          />
          <MinMaxValInput
            label='Minimum Value'
            value={parseInt(minVal, 10)}
            name={`input-minval-name-${i}`}
            limitVal={0}
            onChange={(e) =>
              actions.setMinVal({
                i,
                val: e.target.value
              })
            }
          />
        </React.Fragment>
      )}
      {
        <React.Fragment>
          {[BUTTON, BUTTON_CC, BUTTON_TOGGLE, BUTTON_TOGGLE_CC].includes(
            type
          ) && (
            <React.Fragment>
              <MinMaxValInput
                label='Value Button On'
                value={onVal}
                name={`input-onval-name-${i}`}
                limitVal={127}
                onChange={(e) =>
                  actions.setOnVal({
                    i,
                    val: e.target.value
                  })
                }
              />
              <MinMaxValInput
                label='Value Button Off'
                value={offVal}
                name={`input-offval-name-${i}`}
                limitVal={0}
                onChange={(e) =>
                  actions.setOffVal({
                    i,
                    val: e.target.value
                  })
                }
              />
            </React.Fragment>
          )}
        </React.Fragment>
      }
    </React.Fragment>
  )
}
