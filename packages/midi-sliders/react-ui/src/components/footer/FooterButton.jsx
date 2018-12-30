import React from 'react'
import { Button } from '@material-ui/core'

export const FooterButton = props => {
  const { classes, item, lastFocusedFooterButtonIdx, isLiveMode, actions } = props
  return (
    <Button
      className={classes.button}
      style={{
        boxShadow: item.i === lastFocusedFooterButtonIdx && '0 0 3px 3px rgb(24, 164, 157)',
        background: item.colors.color, 
        color: item.colors.colorFont
      }}
      onClick={ handleClick.bind(this, {item, isLiveMode, actions})}
      value={item.i}
    >
      {item && item.label}
    </Button>
  )
}

const handleClick = ({item, isLiveMode, actions}) => {
  actions.setFooterButtonFocus({i: item.i})
  if (isLiveMode) {
    actions.extractPage({ label: item.label })
  } else {
    scrollByIndex(item.i);
  }
}

function scrollByIndex(i) {
  const elem = document.getElementById(`page-${i}`);
  elem.scrollIntoView({ block: 'start' });
}