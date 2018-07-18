import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSlidersAction from '../../actions/midi-sliders.js'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import AddIcon from '@material-ui/icons/Add'
import Tooltip from '@material-ui/core/Tooltip'
import ScrollButtonGroup from './ScrollButtonGroup'
import ViewMenu from './ViewMenu'

class MenuAppBar extends React.Component {
  render () {
    const { classes, sliderList } = this.props
    return (
      <div className={classes.root}>
        <AppBar position='static'>
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
              MIDI Sliders
            </Typography>

            <ScrollButtonGroup sliderListLength={sliderList.length} />

            {
              sliderList.length < 80 ? (
                <Tooltip
                  placement='right'
                  title='Add Slider'
                >
                  <IconButton
                    aria-haspopup='true'
                    onClick={this.props.actions.addSlider}
                    color='inherit'
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <div />
              )
            }

            <ViewMenu />

          </Toolbar>
        </AppBar>
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
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
})

function mapStateToProps (state) {
  return {
    sliderList: state.sliderList
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSlidersAction, dispatch)
  }
}

export default (withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MenuAppBar)))
