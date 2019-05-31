import React from 'react'
import { Button } from '@material-ui/core'
import { PropTypes } from 'prop-types'

FooterButton.propTypes = {
  actions: PropTypes.object,
  classes: PropTypes.object,
  isSettingsMode: PropTypes.bool,
  item: PropTypes.object,
  lastFocusedPage: PropTypes.string
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
    actions
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
          ? () => {
            actions.setLastFocusedIndex({ i: id })
            actions.setLastFocusedPage({ lastFocusedPage: id })
            actions.toggleSettingsDialogMode({
              i: id,
              isSettingsDialogMode: true,
              lastFocusedPage: id
            })
          }
          : handleClick.bind(this, {
            id,
            actions,
            lastFocusedPage
          })
      }
      value={id}
    >
      {label && label}
    </Button>
  )
}

function handleClick({ id, actions, lastFocusedPage }) {
  actions.setLastFocusedIndex({i: 'none'})
  actions.setLastFocusedPage({ lastFocusedPage: id })
  actions.setMidiPage({focusedPage: id })
}
