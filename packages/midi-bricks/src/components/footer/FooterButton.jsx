import React from 'react'
import { useDispatch } from 'react-redux'
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
  const dispatch = useDispatch()
  const {
    classes,
    item: {
      id,
      label,
      colors: { color, colorFont }
    },
    lastFocusedPage,
    isSettingsMode,
    //actions,
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
      onClick={isSettingsMode ? handleSettingsClick : handleClick}
      value={id}
    >
      {label || ''}
    </Button>
  )
  function handleSettingsClick() {
    dispatch(thunkChangePage(lastFocusedPage, id))
    // dispatch(
    //   toggleSettingsDialogMode({
    //     i: id,
    //     isSettingsDialogMode: true,
    //     lastFocusedPage: id
    //   })
    // )
  }

  function handleClick() {
    dispatch(thunkChangePage(lastFocusedPage, id))
  }
}
