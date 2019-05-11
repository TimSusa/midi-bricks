import React from 'react'
import PropTypes from 'prop-types'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'

MidiSettingsLabelInput.propTypes = {
  actions: PropTypes.object,
  classes: PropTypes.object,
  i: PropTypes.string,
  idx: PropTypes.number,
  label: PropTypes.string,
  type: PropTypes.string
}

export function MidiSettingsLabelInput({
  idx,
  label,
  i,
  classes,
  actions,
  type
}) {
  return (
    <FormControl className={classes.formControl}>
      <InputLabel className={classes.label} htmlFor='label'>
        Label
      </InputLabel>
      <Input
        className={classes.input}
        id='label'
        type='label'
        name={`input-label-name-${idx}`}
        value={label}
        onChange={handleLabelChange.bind(this, i, idx, actions, type)}
        autoFocus
      />
    </FormControl>
  )
}

function handleLabelChange(i, idx, actions, type, e) {
  e.preventDefault()
  e.stopPropagation()

  if (type === undefined) {
    actions.setPageTargetSettings({
      label: e.target.value
    })
  } else {
    actions.changeLabel({
      i,
      val: e.target.value
    })
  }
}
