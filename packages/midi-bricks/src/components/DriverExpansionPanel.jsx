import React from 'react'
import {
  withStyles,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

function DriverExpansionPanel({
  children,
  isEmpty = false,
  classes,
  expanded,
  onChange,
  label,
  noPadding = false,
}) {
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
          color="secondary"
          style={{ color: isEmpty && 'lightgrey' }}
          variant="body1"
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

const styles = theme => ({
  root: {
    margin: theme.spacing(1),
    padding: 0,
  },
  summary: {
    margin: 0,
  },
  heading: {
    margin: theme.spacing(1),
  },
  details: {
    flexDirection: 'column',
    margin: 0,
  },
})

export default withStyles(styles)(DriverExpansionPanel)
