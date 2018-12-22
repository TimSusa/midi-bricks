import React from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'

export function MidiSettingsLabel({
  idx,
  label,
  i,
  classes,
  handleLabelChange,
}) {
  return (
    <FormControl className={classes.formControl}>
      <InputLabel className={classes.label} htmlFor="label">
        Label
      </InputLabel>
      <Input
        className={classes.input}
        id="label"
        type="label"
        name={`input-label-name-${idx}`}
        value={label}
        onChange={handleLabelChange.bind(this, i, idx)}
        autoFocus
      />
    </FormControl>
  )
}
