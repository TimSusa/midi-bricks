import React from 'react'
import { Button } from '@material-ui/core'
import { PropTypes } from 'prop-types'

FooterButton.propTypes = {
  actions: PropTypes.object,
  classes: PropTypes.object,
  isSettingsMode: PropTypes.bool,
  item: PropTypes.object,
  lastFocusedPage: PropTypes.string,
  thunkChangePage: PropTypes.func
}

export function FooterButton(props) {
  const {
    classes,
    item: {
      id,
      label,
      colors: { color, colorFont }
    },
    lastFocusedPage,
    isSettingsMode,
    actions,
    thunkChangePage 
  } = props

  return (
    <Button
      className={classes.button}
      style={{
        boxShadow: id === lastFocusedPage && '0 0 3px 3px rgb(24, 164, 157)',
        background: color,
        color: colorFont
      }}
      onClick={
        isSettingsMode
          ? handleSettingsClick.bind(this, {
            id,
            actions,
            thunkChangePage,
            lastFocusedPage
          })
          : handleClick.bind(this, {
            id,
            actions,
            thunkChangePage,
            lastFocusedPage
          })
      }
      value={id}
    >
      {label && label}
    </Button>
  )
}

function handleSettingsClick({ id, actions, thunkChangePage,  lastFocusedPage }) {
  thunkChangePage(lastFocusedPage, id)
  actions.toggleSettingsDialogMode({
    i: id,
    isSettingsDialogMode: true,
    lastFocusedPage: id
  })
}

function handleClick({ id, actions, thunkChangePage,  lastFocusedPage }) {
  thunkChangePage(lastFocusedPage, id)
}