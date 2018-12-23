import React from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'

export function MinMaxValInput({ label, value, classes, onChange, name, limitVal=0 }) {
  return (
    <FormControl className={classes.formControl}>
      <InputLabel className={classes.label}>
        {`${label}  `}
      </InputLabel>
      <Input
        className={classes.input}
        id="number"
        type="number"
        name={name}
        value={(value && value) || limitVal}
        onChange={onChange}
      />
    </FormControl>
  )
}
