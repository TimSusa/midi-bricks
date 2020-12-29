import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core'
import { PropTypes } from 'prop-types'
import { useTheme } from '@material-ui/styles'

export function ToolTipIconButton(props) {
  const theme = useTheme()
  const classes = makeStyles(styles.bind(this, theme))()
  const { handleClick = () => {}, title = '', icon, isInvisible } = props
  if (isInvisible) return <React.Fragment></React.Fragment>
  return (
    <Tooltip disableHoverListener={false} title={title}>
      <IconButton onClick={handleClick} className={classes.typoColorStyle}>
        {icon}
      </IconButton>
    </Tooltip>
  )
}

ToolTipIconButton.propTypes = {
  handleClick: PropTypes.func,
  icon: PropTypes.any,
  isInvisible: PropTypes.bool,
  title: PropTypes.string
}

function styles(theme) {
  return {
    typoColorStyle: {
      color: theme.palette.primary.contrastText
    }
  }
}
