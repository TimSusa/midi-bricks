import React from 'react'
import { Button } from '@material-ui/core'
import { PropTypes } from 'prop-types'

FooterButton.propTypes = {
  actions: PropTypes.object,
  classes: PropTypes.object,
  isLiveMode: PropTypes.bool,
  item: PropTypes.object,
  lastFocusedPage: PropTypes.string
}

export function FooterButton(props) {
  const { classes, item, lastFocusedPage, isLiveMode, actions } = props

  return (
    <Button
      className={classes.button}
      style={{
        boxShadow:
          item.id === lastFocusedPage && '0 0 3px 3px rgb(24, 164, 157)',
        background: item.colors.color,
        color: item.colors.colorFont
      }}
      onClick={handleClick.bind(this, {
        item,
        isLiveMode,
        actions,
        lastFocusedPage
      })}
      value={item.i}
    >
      {item && item.label}
    </Button>
  )
}

function handleClick({ item, isLiveMode, actions, lastFocusedPage }) {
  actions.setMidiPage({ lastFocusedPage, focusedPage: item.id })
  actions.setLastFocusedPage({ lastFocusedPage: item.id })
}
