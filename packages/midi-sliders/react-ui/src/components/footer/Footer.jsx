import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import IconButton from '@material-ui/core/IconButton'
import LeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import RightIcon from '@material-ui/icons/KeyboardArrowRight'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as ViewSettinsgsAction from '../../actions/view-settings'
import { Button } from '@material-ui/core'

class Footer extends React.Component {
  state = {
    value: 0
  }

  render () {
    const { classes, viewSettings: { footerPages, isSettingsMode, isGlobalSettingsMode }, actions } = this.props
    const { value } = this.state
    if (isGlobalSettingsMode) return (<div />)
    if (footerPages && footerPages.every((item) => (item && item.type !== 'PAGE'))) return (<div />)
    return (
      <BottomNavigation
        value={value}
        onChange={this.handleChange}
        className={classes.root}
      >
        {footerPages && footerPages.map((item, idx) => {
          if (isSettingsMode) {
            return (
              <div
                key={`footer-button-${idx}`}
              >
                <IconButton
                  onClick={actions.swapFooterPages.bind(this, {srcIdx: idx, offset: -1})}
                  className={classes.signButton}
                  color='inherit'
                  aria-label='Menu'
                >
                  <LeftIcon className={classes.iconColor} />
                </IconButton>

                <Button
                  className={classes.button}
                  onClick={this.handleClick.bind(this, item)}
                  value={idx}
                >
                  {item && item.label}
                </Button>

                <IconButton
                  onClick={actions.swapFooterPages.bind(this, {srcIdx: idx, offset: 1})}
                  className={classes.signButton}
                  color='inherit'
                  aria-label='Menu'
                >
                  <RightIcon className={classes.iconColor} />
                </IconButton>
              </div>
            )
          }
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
    justifyContent: 'space-evenly',
    bottom: 0,
    width: '100%',
    position: 'fixed'
  },
  button: {
    color: theme.palette.primary.contrastText,
    fontWeight: 600,
    height: 60
  },
  signButton: {
    width: 16
  },
  iconColor: {
    color: theme.palette.primary.contrastText,
    cursor: 'pointer'
  }
})

function mapStateToProps ({ viewSettings }) {
  return {
    viewSettings
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ ...ViewSettinsgsAction }, dispatch)
  }
}
export default (withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Footer)))
