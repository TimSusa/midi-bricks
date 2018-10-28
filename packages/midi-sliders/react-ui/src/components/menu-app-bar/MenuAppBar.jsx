import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as ViewSettingsAction from '../../actions/view-settings'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import SwapHorizIcon from '@material-ui/icons/SwapHoriz'
import SwapVertIcon from '@material-ui/icons/SwapVert'
import AutoArrangeModeIcon from '@material-ui/icons/Spellcheck'
import AutoArrangeModeIconFalse from '@material-ui/icons/TextFormat'
import ViewMenu from './ViewMenu'
import AddMenu from './AddMenu'

class MenuAppBar extends React.PureComponent {
  render () {
    const { classes, actions, sliderList, viewSettings: { isLiveMode, isLayoutMode, isCompactHorz, isAutoArrangeMode } } = this.props
    if (isLiveMode) {
      return (
        <div />
      )
    }
    return (
      <div className={classes.root}>
        <AppBar
          className={classes.appBar}
          position='fixed'
        >
          <Toolbar>
            <IconButton
              onClick={this.props.handleDrawerToggle}
              className={classes.menuButton}
              color='inherit'
              aria-label='Menu'
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant='h6'
              color='inherit'
              className={classes.flex}
            >
              MIDI Bricks
            </Typography>
            <IconButton
              onClick={actions.toggleCompactMode}
              className={classes.menuButton}
              color='inherit'
              aria-label='Menu'
            >
              {
                isLayoutMode ? (isCompactHorz ? <SwapHorizIcon /> : <SwapVertIcon />) : (<div />)
              }
            </IconButton>

            <IconButton
              onClick={actions.toggleAutoArrangeMode}
              className={classes.menuButton}
              color='inherit'
              aria-label='Menu'
            >
              {
                isLayoutMode ? (isAutoArrangeMode ? <AutoArrangeModeIcon /> : <AutoArrangeModeIconFalse />) : (<div />)
              }
            </IconButton>

            <AddMenu sliderListLength={sliderList.length} />
            <ViewMenu />
          </Toolbar>
        </AppBar>
        <div style={{ height: 64 }} />
      </div>
    )
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired
}

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  appBar: {
    background: theme.palette.appBar.background,
    fontWeight: 600
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
})

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(ViewSettingsAction, dispatch)
  }
}

function mapStateToProps ({ sliderList, viewSettings }) {
  return {
    sliderList,
    viewSettings
  }
}

export default (withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MenuAppBar)))
