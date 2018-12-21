import React from 'react'
import { Button } from '@material-ui/core'

export const FooterButton = props => {
  const { classes, idx, item, value, handleClick } = props
  return (
    <Button
      className={classes.button}
      style={{
        boxShadow: idx === value && '0 0 3px 3px rgb(24, 164, 157)',
      }}
      onClick={ handleClick.bind(this, item, idx)}
      value={idx}
    >
      {item && item.label}
    </Button>
  )
}
