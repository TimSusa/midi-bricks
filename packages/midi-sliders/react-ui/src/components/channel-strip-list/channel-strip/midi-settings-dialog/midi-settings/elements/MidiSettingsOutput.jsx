import React from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import InputNoteOrCc from './InputNoteOrCc'
import {
  renderDriverSelection,
  renderMidiChannelSelection,
} from '../MidiSettings'

import { STRIP_TYPE } from '../../../../../../reducers/slider-list'

const {
  BUTTON,
  BUTTON_CC,
  BUTTON_TOGGLE,
  BUTTON_TOGGLE_CC,
  SLIDER,
  SLIDER_HORZ,
} = STRIP_TYPE

export const MidiSettingsOutput = props => {
  const {
    classes,
    actions,
    sliderEntry,
    sliderEntry: {
      i,
      type,
      minVal,
      maxVal,
      onVal,
      offVal,
      driverName = 'None',
      midiChannel,
    },
    idx,
    outputs,
  } = props
  return (
    <React.Fragment>
      <InputNoteOrCc sliderEntry={sliderEntry} idx={idx} />
      <FormControl className={classes.formControl}>
        <InputLabel className={classes.label} htmlFor="midi-driver">
          Driver
        </InputLabel>
        <Select
          className={classes.select}
          onChange={e =>
            actions.selectMidiDriver({
              i,
              driverName: e.target.value,
            })
          }
          value={driverName || 'None'}
        >
          {renderDriverSelection({
            outputs,
          })}
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel className={classes.label} htmlFor="output-cc-input">
          Channel
        </InputLabel>
        <Select
          className={classes.select}
          onChange={e =>
            actions.selectMidiChannel({
              idx,
              val: e.target.value,
            })
          }
          value={midiChannel || 'None'}
        >
          {renderMidiChannelSelection(
            {
              outputs,
            },
            driverName,
            type
          )}
        </Select>
      </FormControl>
      {[SLIDER, SLIDER_HORZ].includes(type) && (
        <React.Fragment>
          <FormControl className={classes.formControl}>
            <InputLabel className={classes.label} htmlFor="maxVal">
              Maximum Value{' '}
            </InputLabel>
            <Input
              className={classes.input}
              id="number"
              type="number"
              name={`input-maxval-name-${idx}`}
              value={(maxVal && maxVal) || 127}
              onChange={e =>
                actions.setMaxVal({
                  idx,
                  val: e.target.value,
                })
              }
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel className={classes.label} htmlFor="minVal">
              Minimum Value{' '}
            </InputLabel>
            <Input
              className={classes.input}
              id="number"
              type="number"
              name={`input-minval-name-${idx}`}
              value={(minVal && minVal) || 0}
              onChange={e =>
                actions.setMinVal({
                  idx,
                  val: e.target.value,
                })
              }
            />
          </FormControl>
        </React.Fragment>
      )}
      {
        <React.Fragment>
          {[BUTTON, BUTTON_CC, BUTTON_TOGGLE, BUTTON_TOGGLE_CC].includes(
            type
          ) && (
            <React.Fragment>
              <FormControl className={classes.formControl}>
                <InputLabel className={classes.label} htmlFor="onVal">
                  {' '}
                  Value Button On
                </InputLabel>
                <Input
                  className={classes.input}
                  id="number"
                  type="number"
                  name={`input-onval-name-${idx}`}
                  value={(onVal && onVal) || 127}
                  onChange={e =>
                    actions.setOnVal({
                      idx,
                      val: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel className={classes.label} htmlFor="offVal">
                  Value Button Off
                </InputLabel>
                <Input
                  className={classes.input}
                  id="number"
                  type="number"
                  name={`input-offval-name-${idx}`}
                  value={(offVal && offVal) || 0}
                  onChange={e =>
                    actions.setOffVal({
                      idx,
                      val: e.target.value,
                    })
                  }
                />
              </FormControl>
            </React.Fragment>
          )}
        </React.Fragment>
      }
    </React.Fragment>
  )
}
