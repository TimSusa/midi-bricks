import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles(styles, { useTheme: true })

function DriverExpansionPanel({
  children,
  isEmpty = false,
  expanded,
  onChange=()=>{},
  label='',
  noPadding = false
}) {
  const classes = useStyles()
  return (
    <ExpansionPanel
      className={classes.root}
      expanded={expanded}
      onChange={onChange}
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
      margin: theme.spacing(1)
    },
    details: {
      flexDirection: 'column',
      margin: 0
    }
  }
}

export default DriverExpansionPanel
