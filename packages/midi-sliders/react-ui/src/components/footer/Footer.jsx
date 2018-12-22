import { FooterButton } from './FooterButton'
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
import * as SliderSettinsgsAction from '../../actions/slider-list'
import { Button, Tooltip } from '@material-ui/core'
import { PAGE_TYPES } from '../../reducers/view-settings'

class Footer extends React.Component {

  render() {
    const {
      classes,
      footerPages = [],
      lastFocusedFooterButtonIdx,
      isSettingsMode,
      isLiveMode,
      pageType,
      actions,
    } = this.props
    if (pageType !== PAGE_TYPES.HOME_MODE && !isLiveMode) return <div />
    return (
      <BottomNavigation
        value={lastFocusedFooterButtonIdx}
        className={classes.root}
      >
        {footerPages.map((item, idx) => {
          if (isSettingsMode) {
            return (
              <div key={`footer-button-${idx}`}>
                <IconButton
                  onClick={actions.swapFooterPages.bind(this, {
                    srcIdx: idx,
                    offset: -1,
                  })}
                  className={classes.signButton}
                  color="inherit"
                  aria-label="Menu"
                >
                  <LeftIcon className={classes.iconColor} />
                </IconButton>

                <FooterButton
                  classes={classes}
                  value={lastFocusedFooterButtonIdx}
                  idx={item.i}
                  item={item}
                  handleClick={this.handleClick}
                />

                <IconButton
                  onClick={actions.swapFooterPages.bind(this, {
                    srcIdx: idx,
                    offset: 1,
                  })}
                  className={classes.signButton}
                  color="inherit"
                  aria-label="Menu"
                >
                  <RightIcon className={classes.iconColor} />
                </IconButton>
              </div>
            )
          }
          return (
            <FooterButton
              key={`footer-button-${idx}`}
              classes={classes}
              value={lastFocusedFooterButtonIdx}
              idx={item.i}
              item={item}
              handleClick={this.handleClick}
            />
          )
        })}
        <Tooltip title="Toggle Live Mode">
          <Button
            className={classes.liveButton}
            style={{ boxShadow: isLiveMode && '0 0 3px 3px rgb(24, 164, 157)' }}
            onClick={this.handleLiveButtonClick}
          >
            Live
          </Button>
        </Tooltip>
      </BottomNavigation>
    )
  }

  handleClick = ({label, i}, value) => {
    this.props.actions.setFooterButtonFocus({i: value})
    if (this.props.isLiveMode) {
      this.props.actions.extractPage({ label })
    } else {
      scrollByIndex(i);
    }
  }

  handleLiveButtonClick = () => {
    if (this.props.isLiveMode) {
      this.props.actions.goBack()
      this.props.actions.setFooterButtonFocus({i: ''})
    }
    this.props.actions.toggleLiveMode()
  }
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
}
const styles = theme => ({
  root: {
    background: theme.palette.appBar.background,
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'space-evenly',
    bottom: 0,
    width: '100%',
    position: 'fixed',
  },
  button: {
    color: theme.palette.primary.contrastText,
    fontWeight: 600,
    padding: 8,
    marginLeft: 8,
    height: 16,
  },
  liveButton: {
    marginLeft: 'auto',
    marginRight: 8,
    fontWeight: 600,
    color: theme.palette.primary.contrastText,
  },
  signButton: {
    width: 16,
  },
  iconColor: {
    color: theme.palette.primary.contrastText,
    cursor: 'pointer',
  },
})

function scrollByIndex(i) {
  const elem = document.getElementById(`page-${i}`);
  elem.scrollIntoView({ block: 'start' });
}

function mapStateToProps({
  viewSettings: {
    footerPages,
    lastFocusedFooterButtonIdx,
    isSettingsMode,
    isLiveMode,
    pageType,
  },
}) {
  return {
    footerPages,
    lastFocusedFooterButtonIdx,
    isSettingsMode,
    isLiveMode,
    pageType,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...ViewSettinsgsAction, ...SliderSettinsgsAction },
      dispatch
    ),
  }
}
export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Footer)
)
