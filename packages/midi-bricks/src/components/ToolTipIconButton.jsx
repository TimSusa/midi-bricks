import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import { Tooltip } from '@material-ui/core'
import { PropTypes } from 'prop-types'

export function ToolTipIconButton(props) {
  const { handleClick = () => {}, title = '', icon } = props
  return (
    <Tooltip disableHoverListener={false} title={title}>
      <IconButton onClick={handleClick} color='inherit'>
        {icon}
      </IconButton>
    </Tooltip>
  )
}

ToolTipIconButton.propTypes = {
  handleClick: PropTypes.func,
  icon: PropTypes.any,
  title: PropTypes.string
}
