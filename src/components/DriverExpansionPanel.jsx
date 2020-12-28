import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/styles'
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

function DriverExpansionPanel({
  children,
  isEmpty = false,
  expanded,
  onChange = () => {},
  label = '',
  noPadding = false
}) {
  const theme = useTheme()

  const classes = makeStyles(styles.bind(this, theme))()
  return (
    <Accordion className={classes.root} expanded={expanded} onChange={onChange}>
      <AccordionSummary
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
      </AccordionSummary>
      <AccordionDetails
        className={classes.details}
        style={{ padding: noPadding && 0 }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
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
