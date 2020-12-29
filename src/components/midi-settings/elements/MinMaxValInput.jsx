import React from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/styles'
import Tooltip from '@material-ui/core/Tooltip'

MinMaxValInput.propTypes = {
  label: PropTypes.string,
  limitVal: PropTypes.number,
  name: PropTypes.string,
  onChange: PropTypes.func,
  toolTip: PropTypes.string,
  value: PropTypes.number
}

MinMaxValInput.displayName = 'MinMaxValInputComponent'

export function MinMaxValInput({
  label,
  value,
  onChange = () => {},
  name,
  limitVal = 0,
  toolTip,
  max = 127
}) {
  const theme = useTheme()
  const classes = makeStyles(styles.bind(this, theme))()

  const form = (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <InputLabel className={classes.label}>{`${label}  `}</InputLabel>
        <Input
          className={classes.input}
          id='number'
          type='number'
          inputProps={{
            min: 0,
            max
          }}
          name={name}
          value={value || limitVal}
          onChange={onChange}
        />
      </FormControl>
    </div>
  )
  const tip = <Tooltip title={toolTip}>{form}</Tooltip>

  return toolTip ? tip : form
}

function styles(theme) {
  return {
    root: {},
    formControl: {
      margin: theme.spacing(1)
    },
    input: {
      color: theme.palette.primary.contrastText, // 'rgba(0, 0, 0, 0.54)',
      fontSize: '1rem',
      fontWeight: 400,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      lineHeight: '1.375em'
    },
    label: {
      color: theme.palette.primary.contrastText
    }
  }
}
