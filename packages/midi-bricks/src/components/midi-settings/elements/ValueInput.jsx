import React from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import PropTypes from 'prop-types'
import InputAdornment from '@material-ui/core/InputAdornment'
import { makeStyles, useTheme } from '@material-ui/styles'
import { Tooltip } from '@material-ui/core'

ValueInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  toolTip: PropTypes.string,
  value: PropTypes.string,
  isDisabled: PropTypes.bool
}

ValueInput.displayName = 'ValueInputComponent'

export function ValueInput({
  label,
  isDisabled,
  value,
  onChange = () => {},
  name,
  limitVal = 0,
  toolTip,
  icon
}) {
  const theme = useTheme()
  const classes = makeStyles(styles.bind(this, theme))()

  const form = (
    <div className={classes.root}>
      <FormControl className={classes.formControl} disabled={isDisabled}>
        <InputLabel disabled={isDisabled} className={classes.label}>{`${label}  `}</InputLabel>
        <Input
          disabled={isDisabled}
          className={classes.input}
          id='someting-s'
          type='string'
          name={name}
          value={value && value}
          onChange={onChange}
          startAdornment={
            <InputAdornment position='start'>{icon && icon}</InputAdornment>
          }
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
      margin: theme.spacing(1),
      width: '100%'
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
