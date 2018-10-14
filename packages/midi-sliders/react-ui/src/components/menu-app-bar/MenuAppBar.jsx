import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ViewMenu from './ViewMenu'
import AddMenu from './AddMenu'

class MenuAppBar extends React.PureComponent {
  render () {
    const { classes, sliderList, viewSettings: { isLiveMode } } = this.props
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
              variant='title'
              color='inherit'
              className={classes.flex}
            >
              MIDI Bricks
            </Typography>
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

function mapStateToProps ({ sliderList, viewSettings }) {
  return {
    sliderList,
    viewSettings
  }
}

export default (withStyles(styles)(connect(mapStateToProps, null)(MenuAppBar)))
