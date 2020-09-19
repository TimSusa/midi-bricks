import React from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { Typography, MenuItem } from '@material-ui/core'
import InputLabel from '@material-ui/core/InputLabel'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import ColorModal from './ColorModal'
import { STRIP_TYPE } from '../../../global-state/reducers/slider-list'
import { Actions as MidiSliderActions } from '../../../global-state/actions/slider-list.js'
import { Actions as ViewActions } from '../../../global-state/actions/view-settings.js'

const {
  changeButtonType,
  changeFontSize,
  changeFontWeight,
  changeColors,
  setPageTargetSettings,
  toggleHideValue
} = {
  ...MidiSliderActions,
  ...ViewActions
}
const {
  BUTTON,
  BUTTON_CC,
  BUTTON_TOGGLE,
  BUTTON_TOGGLE_CC,
  SLIDER,
  SLIDER_HORZ
} = STRIP_TYPE

MidiSettingsView.propTypes = {
  classes: PropTypes.object,
  type: PropTypes.string,
  sliderEntry: PropTypes.object,
  pageTarget: PropTypes.object
}

export function MidiSettingsView(props) {
  const dispatch = useDispatch()
  const {
    classes,
    type: pageType,
    sliderEntry: { i, type, colors, fontSize, fontWeight, isValueHidden } = {},
    pageTarget = {}
  } = props
  const color = !pageType
    ? colors.color
    : pageTarget && pageTarget.colors && pageTarget.colors.color
  const colorFont = !pageType
    ? colors.colorFont
    : pageTarget && pageTarget.colors && pageTarget.colors.colorFont
  return (
    <React.Fragment>
      <FormControl>
        {[BUTTON, BUTTON_CC, BUTTON_TOGGLE, BUTTON_TOGGLE_CC].includes(
          type
        ) && (
          <React.Fragment>
            <InputLabel className={classes.label} htmlFor='button-type'>
              Type
            </InputLabel>
            <Select
              className={classes.select}
              onChange={handleButtonTypeChange}
              value={type}
            >
              {renderButtonTypeSelection(type)}
            </Select>
          </React.Fragment>
        )}

        <ColorModal
          title='Background'
          i={i}
          fieldName='color'
          color={color}
          onChange={
            !pageType
              ? (e) => dispatch(changeColors(e))
              : (e) => dispatch(setPageTargetSettings(e))
          }
        />
        {!pageType && (
          <ColorModal
            title={
              [SLIDER, SLIDER_HORZ].includes(type)
                ? 'Thumb Background'
                : 'Activated State'
            }
            i={i}
            fieldName='colorActive'
            color={colors.colorActive}
            onChange={(e) => dispatch(changeColors(e))}
          />
        )}
        <ColorModal
          title='Font-Color'
          i={i}
          fieldName='colorFont'
          color={colorFont}
          onChange={
            !pageType ? (e) => dispatch(changeColors(e)) : setPageTargetSettings
          }
        />

        {!pageType && ![SLIDER, SLIDER_HORZ].includes(type) ? (
          <ColorModal
            title='Activated Font-Color'
            i={i}
            fieldName='colorFontActive'
            color={colors.colorFontActive}
            onChange={(e) => dispatch(changeColors(e))}
          />
        ) : null}
      </FormControl>

      {!pageType && (
        <FormControl>
          <Typography className={classes.label} htmlFor='fontsize'>
            {'Font Size:  ' + (fontSize || 16) + 'px'}
          </Typography>
          <input
            type='range'
            min={8}
            max={54}
            value={fontSize || 16}
            onChange={handleFontsizeChange}
          />
          <Typography className={classes.label} htmlFor='fontWeight'>
            {'Font Weight:  ' + (fontWeight || 500)}
          </Typography>
          <input
            type='range'
            min={100}
            max={900}
            step={100}
            value={fontWeight || 500}
            onChange={handleFontweightChange}
          />
        </FormControl>
      )}
      {[SLIDER, SLIDER_HORZ].includes(type) && (
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                className={classes.iconColor}
                checked={isValueHidden || false}
                onChange={(e) => dispatch(toggleHideValue(e))}
              />
            }
            label='Hide Value'
          />
        </FormControl>
      )}
    </React.Fragment>
  )
  function handleButtonTypeChange(e) {
    dispatch(
      changeButtonType({
        i,
        val: e.target.value
      })
    )
  }

  function handleFontsizeChange(e) {
    dispatch(
      changeFontSize({
        i,
        fontSize: e.target.value
      })
    )
  }

  function handleFontweightChange(e) {
    dispatch(
      changeFontWeight({
        i,
        fontWeight: e.target.value
      })
    )
  }
}

function renderButtonTypeSelection(type) {
  const isCC = type.endsWith('_CC')
  if (isCC) {
    return [BUTTON_CC, BUTTON_TOGGLE_CC].map((item, btnIdx) => {
      return (
        <MenuItem key={`button-type-cc-${btnIdx}`} value={item}>
          {item}
        </MenuItem>
      )
    })
  } else {
    return [BUTTON, BUTTON_TOGGLE].map((item, btnIdx) => {
      return (
        <MenuItem key={`button-type-${btnIdx}`} value={item}>
          {item}
        </MenuItem>
      )
    })
  }
}
