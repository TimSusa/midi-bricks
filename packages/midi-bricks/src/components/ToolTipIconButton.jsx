import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import { Tooltip } from '@material-ui/core'
import { PropTypes } from 'prop-types'

export function ToolTipIconButton(props) {
  const { handleClick = () => {}, title = '', icon, isDisabled = false } = props
  return (
    <Tooltip disableHoverListener={false} title={title}>
      <div>
        <IconButton onClick={handleClick} color='inherit' disabled={isDisabled}>
          {icon}
        </IconButton>
      </div>
    </Tooltip>
  )
}

ToolTipIconButton.propTypes = {
  handleClick: PropTypes.func,
  icon: PropTypes.any,
  isDisabled: PropTypes.bool,
  title: PropTypes.string
}
