import React, { createRef } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/styles'
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'



function DriverExpansionPanel({
  children,
  isEmpty = false,
  expanded,
  onChange=()=>{},
  label='',
  noPadding = false,
}) {
  const theme = useTheme()
  const ref = createRef()

  const classes = makeStyles(styles.bind(this, theme))()
  return (
    <ExpansionPanel
      className={classes.root}
      expanded={expanded}
      onChange={onChange}
      ref={ref}
      onClick={onHandleClickScrollTo}
    >
      <ExpansionPanelSummary
        className={classes.summary}
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography
          className={classes.heading}
          color='secondary'
          style={{ color: isEmpty && 'lightgrey' }}
          variant='body1'
        >
          {label}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails
        className={classes.details}
        style={{ padding: noPadding && 0 }}
      >
        {children}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
  function onHandleClickScrollTo(){
    ref.current.scrollIntoView({
      behavior: 'smooth', block: 'start', inline: 'nearest'
    })
  }
}

DriverExpansionPanel.propTypes = {
  children: PropTypes.any,
  expanded: PropTypes.bool,
  isEmpty: PropTypes.bool,
  label: PropTypes.string,
  noPadding: PropTypes.bool,
  onChange: PropTypes.func
}

function styles(theme) {
  return {
    root: {
      margin: theme.spacing(1),
      padding: 0
    },
    summary: {
      margin: 0
    },
    heading: {
      margin: theme.spacing(1),
      color: theme.palette.primary.contrastText
    },
    details: {
      flexDirection: 'column',
      margin: 0
    }
  }
}

export default DriverExpansionPanel
