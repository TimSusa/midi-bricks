import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import { connect } from 'react-redux'
import { Button } from '@material-ui/core'

class Footer extends React.PureComponent {
  state = {
    value: 0
  }

  render () {
    const { classes, viewSettings: { footerPages } } = this.props
    const { value } = this.state
    if (footerPages && footerPages.every((item) => (item && item.type !== 'PAGE'))) return (<div />)
    return (
      <BottomNavigation
        value={value}
        onChange={this.handleChange}
        className={classes.root}
      >
        {footerPages && footerPages.map((item, idx) => {
          return (
            <Button
              className={classes.button}
              key={`footer-button-${idx}`}
              onClick={this.handleClick.bind(this, item)}
              value={idx}
            >
              {item && item.label}
            </Button>
          )
        })}
      </BottomNavigation>
    )
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  handleClick = (entry, e) => {
    const elem = document.getElementById(`page-${entry.i}`)
    elem.scrollIntoView({ block: 'start' })
  }
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired
}
const styles = (theme) => ({
  root: {
    background: theme.palette.appBar.background,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  button: {
    color: theme.palette.primary.contrastText,
    fontWeight: 600
  }
})

function mapStateToProps ({ viewSettings }) {
  return {
    viewSettings
  }
}
export default (withStyles(styles)(connect(mapStateToProps, null)(Footer)))
