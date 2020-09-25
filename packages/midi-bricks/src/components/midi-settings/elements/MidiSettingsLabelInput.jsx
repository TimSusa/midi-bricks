import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
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
  const [value, setValue] = useState(label)
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
        value={value || ''}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
      />
      <Button variant='contained' onClick={handleLabelChange}>
        OK
      </Button>
    </FormControl>
  )
  function handleLabelChange(e) {
    e.preventDefault()
    e.stopPropagation()

    if (type === undefined) {
      dispatch(
        setPageTargetSettings({
          label: value,
          lastFocusedPage
        })
      )
    } else {
      dispatch(
        changeLabel({
          i,
          val: value,
          lastFocusedPage
        })
      )
    }
  }
}
