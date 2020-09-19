import { FooterButton } from './FooterButton'
import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/styles'
import IconButton from '@material-ui/core/IconButton'
import LeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import RightIcon from '@material-ui/icons/KeyboardArrowRight'
import { useSelector, useDispatch } from 'react-redux'
import { Actions as ViewSettinsgsAction } from '../../global-state/actions/view-settings'
import { Actions as SliderSettinsgsAction } from '../../global-state/actions/slider-list'
import { thunkLiveModeToggle } from '../../global-state/actions/thunks/thunk-live-mode-toggle'
import { Button, Tooltip } from '@material-ui/core'
import { PAGE_TYPES } from '../../global-state'

const isWebMode = process.env.REACT_APP_IS_WEB_MODE === 'true'

const {
  swapFooterPages,
  setLastFocusedIndex,
  toggleSettingsDialogMode,
  setLastFocusedPage
} = { ...ViewSettinsgsAction, ...SliderSettinsgsAction }

export default Footer

Footer.propTypes = {
  footerPages: PropTypes.array,
  isFullscreenOnLivemode: PropTypes.bool,
  isLiveMode: PropTypes.bool,
  isSettingsDialogMode: PropTypes.bool,
  isSettingsMode: PropTypes.bool,
  lastFocusedIdx: PropTypes.string,
  lastFocusedPage: PropTypes.string,
  pageTargets: PropTypes.array,
  pageType: PropTypes.string,
  thunkChangePage: PropTypes.func,
  thunkLiveModeToggle: PropTypes.func
}

function Footer() {
  const dispatch = useDispatch()
  const theme = useTheme()
  const classes = makeStyles(styles.bind(this, theme))()
  const {
    pageTargets,
    lastFocusedPage,

    isSettingsDialogMode,
    lastFocusedIdx,
    isSettingsMode,

    isFullscreenOnLivemode,
    isLiveMode,
    pageType
  } = useSelector((state) => state.viewSettings)

  const isOpen = isSettingsDialogMode && lastFocusedIdx === lastFocusedPage
  if (isOpen) {
    var MidiSettingsDialog = React.lazy(() =>
      import('../midi-settings-dialog/MidiSettingsDialog')
    )
  }
  return (
    <div className={classes.root}>
      {pageTargets.map((item) => {
        if (isSettingsMode) {
          return (
            <div key={`footer-button-${item.id}`}>
              <IconButton
                onClick={swapFooterPages.bind(this, {
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
              />

              <IconButton
                onClick={swapFooterPages.bind(this, {
                  srcIdx: item.id,
                  offset: 1
                })}
                className={classes.signButton}
                color='inherit'
                aria-label='Menu'
              >
                <RightIcon className={classes.iconColor} />
              </IconButton>
              {isOpen ? (
                <Suspense fallback={<div>Loading MidiSettingsDialog...</div>}>
                  <MidiSettingsDialog
                    open={isOpen}
                    onClose={() => {
                      dispatch(setLastFocusedIndex({ i: '' }))
                      dispatch(
                        toggleSettingsDialogMode({
                          i: '',
                          isSettingsDialogMode: false,
                          lastFocusedPage
                        })
                      )
                    }}
                    sliderEntry={pageTargets.find(
                      (itemt) => itemt.id === lastFocusedPage
                    )}
                    iconColor={classes.iconColor}
                  />
                </Suspense>
              ) : (
                <div />
              )}
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
            onClick={handleLiveButtonClick}
          >
            Live
          </Button>
        </Tooltip>
      )}
    </div>
  )
  async function handleLiveButtonClick() {
    // TODO: Seems to make no sense at all, get rid of it
    if (isLiveMode) {
      isWebMode && isFullscreenOnLivemode && document.exitFullscreen()
    } else {
      isWebMode && isFullscreenOnLivemode && document.body.requestFullscreen()
    }
    dispatch(setLastFocusedPage({ lastFocusedPage }))
    await dispatch(thunkLiveModeToggle())
  }
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
