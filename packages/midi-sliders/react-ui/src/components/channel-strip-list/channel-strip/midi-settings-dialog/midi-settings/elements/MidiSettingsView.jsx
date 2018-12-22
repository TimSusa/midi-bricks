import React from 'react'
import { Typography } from '@material-ui/core'
import InputLabel from '@material-ui/core/InputLabel'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import ColorModal from './ColorModal'

import { STRIP_TYPE } from '../../../../../../reducers/slider-list'

const {
  BUTTON,
  BUTTON_CC,
  BUTTON_TOGGLE,
  BUTTON_TOGGLE_CC,
  SLIDER,
  SLIDER_HORZ,
} = STRIP_TYPE

export const MidiSettingsView = props => {
  const {
    idx,
    classes,
    sliderEntry: { i, type, colors, fontSize, fontWeight, isValueHidden },
    actions,
    handleButtonTypeChange,
    renderButtonTypeSelection,
    handleFontsizeChange,
    handleFontweightChange,
  } = props
  return (
    <React.Fragment>
      {![SLIDER, SLIDER_HORZ].includes(type) && (
        <FormControl>
          {[BUTTON, BUTTON_CC, BUTTON_TOGGLE, BUTTON_TOGGLE_CC].includes(
            type
          ) && (
            <React.Fragment>
              <InputLabel className={classes.label} htmlFor="button-type">
                Type
              </InputLabel>
              <Select
                className={classes.select}
                onChange={handleButtonTypeChange.bind(this, idx)}
                value={type}
              >
                {renderButtonTypeSelection()}
              </Select>
            </React.Fragment>
          )}

          <ColorModal
            title="Background"
            i={i}
            fieldName="color"
            color={colors.color}
          />
          <ColorModal
            title="Activated State"
            i={i}
            fieldName="colorActive"
            color={colors.colorActive}
          />
          <ColorModal
            title="Font-Color"
            i={i}
            fieldName="colorFont"
            color={colors.colorFont}
          />

          <ColorModal
            title="Activated Font-Color"
            i={i}
            fieldName="colorFontActive"
            color={colors.colorFontActive}
          />
        </FormControl>
      )}

      <FormControl>
        <Typography className={classes.label} htmlFor="fontsize">
          {'Font Size:  ' + (fontSize || 16) + 'px'}
        </Typography>
        <input
          type="range"
          min={8}
          max={54}
          value={fontSize || 16}
          onChange={handleFontsizeChange.bind(this, i)}
        />
        <Typography className={classes.label} htmlFor="fontWeight">
          {'Font Weight:  ' + (fontWeight || 500)}
        </Typography>
        <input
          type="range"
          min={100}
          max={900}
          step={100}
          value={fontWeight || 500}
          onChange={handleFontweightChange.bind(this, i)}
        />
      </FormControl>
      {[SLIDER, SLIDER_HORZ].includes(type) && (
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                className={classes.iconColor}
                checked={isValueHidden && isValueHidden}
                onChange={actions.toggleHideValue.bind(this, {
                  i,
                })}
              />
            }
            label="Hide Value"
          />
        </FormControl>
      )}
    </React.Fragment>
  )
}
