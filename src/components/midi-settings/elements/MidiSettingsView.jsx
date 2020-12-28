import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { Typography, MenuItem } from '@material-ui/core'
import InputLabel from '@material-ui/core/InputLabel'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

import ColorModal from './ColorModal'
import { STRIP_TYPE } from '../../../global-state/reducers/slider-list'
import { Actions as MidiSliderActions } from '../../../global-state/actions/slider-list.js'
import { Actions as ViewActions } from '../../../global-state/actions/view-settings.js'
import { ReadFileButton } from './ReadFileButton'

const {
  changeButtonType,
  changeFontSize,
  changeFontWeight,
  changeColors,
  setPageTargetSettings,
  toggleHideValue,
  setBackgroundImage,
  toggleIsStatic
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
  SLIDER_HORZ,
  LABEL
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
    sliderEntry: {
      i,
      type,
      colors,
      fontSize,
      fontWeight,
      isValueHidden,
      backgroundImage,
      static: isStatic
    } = {},
    pageTarget = {}
  } = props
  const color = !pageType
    ? colors.color
    : pageTarget && pageTarget.colors && pageTarget.colors.color
  const colorFont = !pageType
    ? colors.colorFont
    : pageTarget && pageTarget.colors && pageTarget.colors.colorFont

  const [fontSizeLocal, setFontSizeLocal] = useState(fontSize)
  const [fontWeightLocal, setFontWeightLocal] = useState(fontWeight)
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
            value={fontSizeLocal || 16}
            onChange={(e) => setFontSizeLocal(e.target.value)}
          />
          <Button
            variant='contained'
            onClick={() => handleFontsizeChange(fontSizeLocal)}
          >
            OK
          </Button>
          <Typography className={classes.label} htmlFor='fontWeight'>
            {'Font Weight:  ' + (fontWeightLocal || 500)}
          </Typography>
          <input
            type='range'
            min={100}
            max={900}
            step={100}
            value={fontWeightLocal || 500}
            onChange={(e) => setFontWeightLocal(e.target.value)}
          />
          <Button
            onClick={() => handleFontweightChange(fontWeightLocal)}
            variant='contained'
          >
            OK
          </Button>
          <FormControlLabel
            control={
              <Checkbox
                className={classes.iconColor}
                checked={isStatic || false}
                onChange={() => dispatch(toggleIsStatic({ i, isStatic }))}
              />
            }
            label='Set Element to static'
          />
        </FormControl>
      )}

      {type === LABEL && (
        <>
          {!backgroundImage && (
            <ReadFileButton onFileChange={onFileChange}></ReadFileButton>
          )}
          {backgroundImage && (
            <Button
              variant='contained'
              style={{ width: '100%', marginTop: 8 }}
              onClick={() =>
                dispatch(setBackgroundImage({ backgroundImage: null, i }))
              }
            >
              Unload Background Image
            </Button>
          )}
        </>
      )}
      {[SLIDER, SLIDER_HORZ].includes(type) && (
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                className={classes.iconColor}
                checked={isValueHidden || false}
                onChange={() => dispatch(toggleHideValue({ i }))}
              />
            }
            label='Hide Value'
          />
        </FormControl>
      )}
    </React.Fragment>
  )
  function onFileChange(_, file) {
    const contentRaw = file[0][0].target.result
    dispatch(setBackgroundImage({ backgroundImage: contentRaw, i }))
  }
  function handleButtonTypeChange(val) {
    dispatch(
      changeButtonType({
        i,
        val: val.target.value
      })
    )
  }

  function handleFontsizeChange(val) {
    dispatch(
      changeFontSize({
        i,
        fontSize: val
      })
    )
  }

  function handleFontweightChange(val) {
    dispatch(
      changeFontWeight({
        i,
        fontWeight: val
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
