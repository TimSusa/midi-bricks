import React from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import { withStyles } from '@material-ui/core/styles'
import { Tooltip } from '@material-ui/core'

function MinMaxValInputComponent({
  label,
  value,
  classes,
  onChange,
  name,
  limitVal = 0,
  toolTip
}) {
  const form = (
      <FormControl className={classes.formControl}>
        <InputLabel className={classes.label}>{`${label}  `}</InputLabel>
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
  const tip = (
    <Tooltip title={toolTip}>
    {form}
    </Tooltip>
  )

  return toolTip ? tip: form
}

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
  },
  input: {
    color: theme.palette.primary.contrastText, // 'rgba(0, 0, 0, 0.54)',
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em',
  },
  label: {
    color: theme.palette.primary.contrastText,
  },
})

export const MinMaxValInput = withStyles(styles)(MinMaxValInputComponent)
