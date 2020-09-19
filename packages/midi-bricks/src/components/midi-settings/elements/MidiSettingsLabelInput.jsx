import React from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import { Actions as ViewSettinsgsAction } from '../../../global-state/actions/view-settings'
import { Actions as SliderSettinsgsAction } from '../../../global-state/actions/slider-list'

const { setPageTargetSettings, changeLabel } = {
  ...ViewSettinsgsAction,
  ...SliderSettinsgsAction
}
MidiSettingsLabelInput.propTypes = {
  classes: PropTypes.object,
  i: PropTypes.string,
  label: PropTypes.string,
  lastFocusedPage: PropTypes.string,
  type: PropTypes.string
}

export function MidiSettingsLabelInput({
  label,
  i,
  lastFocusedPage,
  classes,
  type
}) {
  const dispatch = useDispatch()
  return (
    <FormControl className={classes.formControl}>
      <InputLabel className={classes.label} htmlFor='label'>
        Label
      </InputLabel>
      <Input
        className={classes.input}
        id='label'
        type='label'
        name={`input-label-name-${i}`}
        value={label}
        onChange={handleLabelChange}
        autoFocus
      />
    </FormControl>
  )
  function handleLabelChange(e) {
    e.preventDefault()
    e.stopPropagation()

    if (type === undefined) {
      dispatch(
        setPageTargetSettings({
          label: e.target.value,
          lastFocusedPage
        })
      )
    } else {
      dispatch(
        changeLabel({
          i,
          val: e.target.value,
          lastFocusedPage
        })
      )
    }
  }
}
