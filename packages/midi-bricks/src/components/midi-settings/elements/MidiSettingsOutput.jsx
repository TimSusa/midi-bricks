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
  idx: PropTypes.number,
  initApp: PropTypes.func,
  outputs: PropTypes.object
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
    idx,
    outputs
  } = props

  return (
    <React.Fragment>
      <InputNoteOrCc midiCC={midiCC} type={type} idx={idx} />
      <FormControl className={classes.formControl}>
        <InputLabel className={classes.label} htmlFor='midi-driver'>
          Driver
        </InputLabel>
        <Select
          className={classes.select}
          onChange={(e) =>
            actions.selectMidiDriver({
              i,
              driverName: e.target.value
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
              idx,
              val: e.target.value
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
            value={maxVal}
            name={`input-maxval-name-${idx}`}
            limitVal={127}
            onChange={(e) =>
              actions.setMaxVal({
                idx,
                val: e.target.value
              })
            }
          />
          <MinMaxValInput
            label='Minimum Value'
            value={minVal}
            name={`input-minval-name-${idx}`}
            limitVal={0}
            onChange={(e) =>
              actions.setMinVal({
                idx,
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
                name={`input-onval-name-${idx}`}
                limitVal={127}
                onChange={(e) =>
                  actions.setOnVal({
                    idx,
                    val: e.target.value
                  })
                }
              />
              <MinMaxValInput
                label='Value Button Off'
                value={offVal}
                name={`input-offval-name-${idx}`}
                limitVal={0}
                onChange={(e) =>
                  actions.setOffVal({
                    idx,
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
