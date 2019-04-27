import { FooterButton } from './FooterButton'
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import IconButton from '@material-ui/core/IconButton'
import LeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import RightIcon from '@material-ui/icons/KeyboardArrowRight'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as ViewSettinsgsAction } from '../../actions/view-settings'
import { Actions as SliderSettinsgsAction } from '../../actions/slider-list'
import { Button, Tooltip } from '@material-ui/core'
import { PAGE_TYPES } from '../../reducers/view-settings'

const isWebMode = process.env.REACT_APP_IS_WEB_MODE === 'true'

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer)

Footer.propTypes = {
  actions: PropTypes.object,
  footerPages: PropTypes.array,
  isFullscreenOnLivemode: PropTypes.bool,
  isLiveMode: PropTypes.bool,
  isSettingsMode: PropTypes.bool,
  lastFocusedFooterButtonIdx: PropTypes.string,
  pageType: PropTypes.string
}

function Footer(props) {
  const classes = makeStyles(styles, { withTheme: true })()
  const {
    footerPages = [],
    lastFocusedFooterButtonIdx = '',
    isSettingsMode = false,
    isLiveMode = false,
    isFullscreenOnLivemode = false,
    pageType = '',
    actions = {}
  } = props

  if (pageType !== PAGE_TYPES.HOME_MODE && !isLiveMode) return <div />

  return (
    <div className={classes.root}>
      {footerPages.map((item, idx) => {
        if (isSettingsMode) {
          return (
            <div key={`footer-button-${idx}`}>
              <IconButton
                onClick={actions.swapFooterPages.bind(this, {
                  srcIdx: idx,
                  offset: -1
                })}
                className={classes.signButton}
                color='inherit'
                aria-label='Menu'
              >
                <LeftIcon className={classes.iconColor} />
              </IconButton>

              <FooterButton
                classes={classes}
                lastFocusedFooterButtonIdx={lastFocusedFooterButtonIdx}
                item={item}
                isLiveMode={isLiveMode}
                actions={actions}
              />

              <IconButton
                onClick={actions.swapFooterPages.bind(this, {
                  srcIdx: idx,
                  offset: 1
                })}
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
          <FooterButton
            key={`footer-button-${idx}`}
            classes={classes}
            lastFocusedFooterButtonIdx={lastFocusedFooterButtonIdx}
            item={item}
            isLiveMode={isLiveMode}
            actions={actions}
          />
        )
      })}
      <Tooltip title='Toggle Live Mode'>
        <Button
          className={classes.liveButton}
          style={{
            boxShadow: isLiveMode && '0 0 3px 3px rgb(24, 164, 157)'
          }}
          onClick={handleLiveButtonClick.bind(
            this,
            isLiveMode,
            actions,
            lastFocusedFooterButtonIdx,
            footerPages,
            isFullscreenOnLivemode
          )}
        >
          Live
        </Button>
      </Tooltip>
    </div>
  )
}

function handleLiveButtonClick(
  isLiveMode,
  actions,
  lastFocusedFooterButtonIdx,
  footerPages,
  isFullscreenOnLivemode
) {
  if (isLiveMode) {
    isWebMode && isFullscreenOnLivemode && document.exitFullscreen()
    actions.goBack()
  } else {
    isWebMode && isFullscreenOnLivemode && document.body.requestFullscreen()
    actions.updateSliderListBackup()
  }
  actions.setFooterButtonFocus({ i: lastFocusedFooterButtonIdx })

  actions.toggleLiveMode()

  // Wait before scrolling into view: This is a very bad bad bad approach...
  let timerId = setTimeout(() => {
    const selector = `[id="page-${lastFocusedFooterButtonIdx}"]`
    const elem = document.querySelector(selector)
    elem && elem.scrollIntoView()
  }, 1000)
  clearTimeout(timerId)
}


function styles(theme) {
  return {
    root: {
      background: theme.palette.appBar.background,
      display: 'flex',
      alignItems: 'center',
      // justifyContent: 'space-evenly',
      bottom: 0,
      width: '100%',
      position: 'fixed',
      margin: 0,
      padding: '0 0 0 4px',
      height: 56
    },
    button: {
      color: theme.palette.primary.contrastText,
      fontWeight: 600,
      padding: 4,
      marginLeft: 0,
      marginRight: 4,
      textTransform: 'none'
    },
    liveButton: {
      marginLeft: 'auto',
      marginRight: 8,
      fontWeight: 600,
      color: theme.palette.primary.contrastText
    },
    signButton: {
      width: 8,
      padding: 4,
      margin: 2
    },
    iconColor: {
      color: theme.palette.primary.contrastText,
      cursor: 'pointer'
    }
  }
}

function mapStateToProps({
  viewSettings: {
    footerPages,
    lastFocusedFooterButtonIdx,
    isSettingsMode,
    isFullscreenOnLivemode,
    isLiveMode,
    pageType
  }
}) {
  return {
    footerPages,
    lastFocusedFooterButtonIdx,
    isSettingsMode,
    isLiveMode,
    pageType,
    isFullscreenOnLivemode
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...ViewSettinsgsAction, ...SliderSettinsgsAction },
      dispatch
    )
  }
}

