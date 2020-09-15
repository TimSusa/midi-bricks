import { MinMaxValInput } from './MinMaxValInput'
import React from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import InputNoteOrCc from './InputNoteOrCc'
import {
  renderDriverSelection,
  renderMidiChannelSelection
} from '../MidiSettings'

import { STRIP_TYPE } from '../../../global-state/reducers/slider-list'
import { PropTypes } from 'prop-types'

const { SLIDER, SLIDER_HORZ, XYPAD } = STRIP_TYPE

export const MidiSettingsOutputY = (props) => {
  const {
    classes,
    actions,
    sliderEntry: {
      i,
      type,
      yMinVal,
      yMaxVal,
      //onVal,
      //offVal,
      yDriverName = 'None',
      yMidiChannel,
      yMidiCc
    } = {},
    outputs
  } = props
  return (
    <React.Fragment>
      <InputNoteOrCc i={i} yMidiCc={yMidiCc} type={type} />
      <FormControl className={classes.formControl}>
        <InputLabel className={classes.label} htmlFor='midi-driver'>
          Driver
        </InputLabel>
        <Select
          className={classes.select}
          onChange={(e) =>
            actions.changeXypadSettings({
              i,
              yDriverName: e.target.value
            })
          }
          value={yDriverName || 'None'}
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
            actions.changeXypadSettings({
              i,
              yMidiChannel: e.target.value
            })
          }
          value={yMidiChannel || 'None'}
        >
          {renderMidiChannelSelection(
            {
              outputs
            },
            yDriverName,
            type
          )}
        </Select>
      </FormControl>
      {[SLIDER, SLIDER_HORZ, XYPAD].includes(type) && (
        <React.Fragment>
          <MinMaxValInput
            label='Maximum Value'
            value={yMaxVal}
            name={`input-maxval-name-${i}`}
            limitVal={127}
            onChange={(e) =>
              actions.changeXypadSettings({
                i,
                yMaxVal: e.target.value
              })
            }
          />
          <MinMaxValInput
            label='Minimum Value'
            value={yMinVal}
            name={`input-yMinVal-name-${i}`}
            limitVal={0}
            onChange={(e) =>
              actions.changeXypadSettings({
                i,
                yMinVal: e.target.value
              })
            }
          />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

MidiSettingsOutputY.propTypes = {
  actions: PropTypes.object,
  classes: PropTypes.object,
  outputs: PropTypes.any,
  sliderEntry: PropTypes.object
}
