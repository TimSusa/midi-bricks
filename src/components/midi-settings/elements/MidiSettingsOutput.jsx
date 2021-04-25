import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import { useDispatch } from 'react-redux'
import { MinMaxValInput } from './MinMaxValInput'
import PropTypes from 'prop-types'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import InputNoteOrCc from './InputNoteOrCc'
import {
  renderDriverSelection,
  renderMidiChannelSelection
} from '../MidiSettings'

import { STRIP_TYPE } from '../../../global-state/reducers/slider-list'

import { Actions as ViewSettinsgsAction } from '../../../global-state/actions/view-settings'
import { Actions as SliderSettinsgsAction } from '../../../global-state/actions/slider-list'

const {
  selectMidiDriver,
  selectMidiChannel,
  setMaxVal,
  setMinVal,
  setOnVal,
  setOffVal
} = {
  ...ViewSettinsgsAction,
  ...SliderSettinsgsAction
}

const {
  BUTTON,
  BUTTON_CC,
  BUTTON_TOGGLE,
  BUTTON_TOGGLE_CC,
  SLIDER,
  SLIDER_HORZ,
  ROTARY_KNOB
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
  const dispatch = useDispatch()
  const {
    classes,
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
  const [minV, setMinV] = useState(minVal)
  const [onV, setOnV] = useState(onVal)
  const [maxV, setMaxV] = useState(maxVal)
  const [offV, setOffV] = useState(offVal)

  const isButton = [BUTTON, BUTTON_CC, BUTTON_TOGGLE, BUTTON_TOGGLE_CC].includes(
    type
  )
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
            dispatch(
              selectMidiDriver({
                i,
                driverName: e.target.value,
                lastFocusedPage
              })
            )
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
            dispatch(
              selectMidiChannel({
                i,
                val: parseInt(e.target.value, 10),
                lastFocusedPage
              })
            )
          }
          value={`${midiChannel}` || 'None'}
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
      {[SLIDER, SLIDER_HORZ, ROTARY_KNOB].includes(type) && (
        <React.Fragment>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <MinMaxValInput
              label='Max Value'
              value={parseInt(maxV, 10)}
              name={`input-maxval-name-${i}`}
              limitVal={127}
              onChange={(e) => setMaxV(e.target.value)}
            />
            <Button
              style={{ height: '60%' }}
              variant='contained'
              onClick={() =>
                dispatch(
                  setMaxVal({
                    i,
                    val: maxV
                  })
                )
              }
            >
              OK
            </Button>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <MinMaxValInput
              label='Min Value'
              value={parseInt(minV, 10)}
              name={`input-minval-name-${i}`}
              limitVal={0}
              onChange={(e) => setMinV(e.target.value)}
            />
            <Button
              variant='contained'
              style={{ height: '60%' }}
              onClick={() =>
                dispatch(
                  setMinVal({
                    i,
                    val: minV
                  })
                )
              }
            >
              OK
            </Button>
          </div>
        </React.Fragment>
      )}
      {
        <React.Fragment>
          {
            isButton && (
              <React.Fragment>
                <MinMaxValInput
                  label='Value Button On'
                  value={onV}
                  name={`input-onval-name-${i}`}
                  limitVal={127}
                  onChange={(e) => setOnV(e.target.value)}
                />
                <Button
                  variant='contained'
                  onClick={() =>
                    dispatch(
                      setOnVal({
                        i,
                        val: onV
                      })
                    )
                  }
                >
                  OK
                </Button>
                <MinMaxValInput
                  label='Value Button Off'
                  value={offV}
                  name={`input-offval-name-${i}`}
                  limitVal={0}
                  onChange={(e) => setOffV(e.target.value)}
                />
                <Button
                  variant='contained'
                  onClick={() =>
                    dispatch(
                      setOffVal({
                        i,
                        val: offV
                      })
                    )
                  }
                >
                  OK
                </Button>
              </React.Fragment>
            )}
        </React.Fragment>
      }
    </React.Fragment>
  )
}
