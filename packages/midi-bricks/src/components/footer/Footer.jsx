import { FooterButton } from './FooterButton'
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import IconButton from '@material-ui/core/IconButton'
import LeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import RightIcon from '@material-ui/icons/KeyboardArrowRight'

import { thunkChangePage } from '../../actions/thunks/thunk-change-page'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as ViewSettinsgsAction } from '../../actions/view-settings'
import { Actions as SliderSettinsgsAction } from '../../actions/slider-list'
import { ActionCreators as UndoActions } from 'redux-undo'
import { Button, Tooltip } from '@material-ui/core'
import { PAGE_TYPES } from '../../reducers'
import MidiSettingsDialog from '../midi-settings-dialog/MidiSettingsDialog'

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
  isSettingsDialogMode: PropTypes.bool,
  isSettingsMode: PropTypes.bool,
  lastFocusedIdx: PropTypes.string,
  lastFocusedPage: PropTypes.string,
  pageTargets: PropTypes.array,
  pageType: PropTypes.string,
  thunkChangePage: PropTypes.any
}

function Footer(props) {
  const classes = makeStyles(styles, { withTheme: true })()
  const {
    footerPages = [],
    pageTargets = [],
    lastFocusedPage,
    lastFocusedIdx,
    isSettingsMode = false,
    isSettingsDialogMode,
    isLiveMode = false,
    isFullscreenOnLivemode = false,
    pageType = '',
    actions,
    thunkChangePage
  } = props
  //if (!isLiveMode) return <div />
  return (
    <div className={classes.root}>
      {pageTargets.map((item) => {
        if (isSettingsMode) {
          return (
            <div key={`footer-button-${item.id}`}>
              <IconButton
                onClick={actions.swapFooterPages.bind(this, {
                  srcIdx: item.id,
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
                lastFocusedPage={lastFocusedPage}
                item={item}
                isSettingsMode={isSettingsMode}
                actions={actions}
                thunkChangePage={thunkChangePage}
              />

              <IconButton
                onClick={actions.swapFooterPages.bind(this, {
                  srcIdx: item.id,
                  offset: 1
                })}
                className={classes.signButton}
                color='inherit'
                aria-label='Menu'
              >
                <RightIcon className={classes.iconColor} />
              </IconButton>

              <MidiSettingsDialog
                open={
                  isSettingsDialogMode && lastFocusedIdx === lastFocusedPage
                }
                onClose={() => {
                  actions.setLastFocusedIndex({ i: '' })
                  actions.toggleSettingsDialogMode({
                    i: '',
                    isSettingsDialogMode: false,
                    lastFocusedPage
                  })
                }}
                sliderEntry={pageTargets.find(
                  (item) => item.id === lastFocusedPage
                )}
              />
            </div>
          )
        }
        // not in settings mode
        return (
          <FooterButton
            key={`footer-button-${item.id}`}
            classes={classes}
            lastFocusedPage={lastFocusedPage}
            item={item}
            isSettingsMode={isSettingsMode}
            actions={actions}
            thunkChangePage={thunkChangePage}
          />
        )
      })}
      {pageType === PAGE_TYPES.HOME_MODE && (
        <Tooltip title='Toggle Live Mode'>
          <Button
            className={classes.liveButton}
            style={{
              boxShadow: isLiveMode && '0 0 3px 3px rgb(24, 164, 157)'
            }}
            onClick={handleLiveButtonClick.bind(
              this,
              isLiveMode,
              lastFocusedPage,
              actions,
              footerPages,
              isFullscreenOnLivemode
            )}
          >
            Live
          </Button>
        </Tooltip>
      )}
    </div>
  )
}

function handleLiveButtonClick(
  isLiveMode,
  lastFocusedPage,
  actions,
  footerPages,
  isFullscreenOnLivemode
) {
  // TODO: Seems to make no sense at all, get rid of it
  if (isLiveMode) {
    isWebMode && isFullscreenOnLivemode && document.exitFullscreen()
  } else {
    isWebMode && isFullscreenOnLivemode && document.body.requestFullscreen()
  }
  actions.setLastFocusedPage({ lastFocusedPage })
  actions.toggleLiveMode()
  actions.clearHistory()
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
  present: {
    viewSettings: {
      footerPages,
      pageTargets,
      lastFocusedPage,
      lastFocusedIdx,
      isSettingsMode,
      isSettingsDialogMode,
      isFullscreenOnLivemode,
      isLiveMode,
      pageType
    }
  }
}) {
  return {
    footerPages,
    pageTargets,
    lastFocusedPage,
    lastFocusedIdx,
    isSettingsMode,
    isSettingsDialogMode,
    isLiveMode,
    pageType,
    isFullscreenOnLivemode
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...UndoActions, ...ViewSettinsgsAction, ...SliderSettinsgsAction },
      dispatch
    ),
    thunkChangePage: bindActionCreators(thunkChangePage, dispatch)
  }
}
