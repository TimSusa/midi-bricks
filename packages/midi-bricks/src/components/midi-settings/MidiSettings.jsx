import React from 'react'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import Tooltip from '@material-ui/core/Tooltip'
import CopyIcon from '@material-ui/icons/NoteAdd'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/styles'
import { connect } from 'react-redux'
import { initApp } from '../../actions/init.js'

import { bindActionCreators } from 'redux'
import { Actions as MidiSliderActions } from '../../actions/slider-list.js'
import { Actions as ViewActions } from '../../actions/view-settings.js'
import DeleteModal from '../DeleteModal'
import DriverExpansionPanel from '../DriverExpansionPanel'
import MidiSettingsInput from './elements/MidiSettingsInput'
import { MidiSettingsLabelInput } from './elements/MidiSettingsLabelInput'
import { MidiSettingsOutput } from './elements/MidiSettingsOutput'
import { MidiSettingsOutputY } from './elements/MidiSettingsOutputY'
import { MidiSettingsView } from './elements/MidiSettingsView'
import { DriverEmtpyRedirectButton } from './elements/DriverEmtpyRedirectButton'

import { STRIP_TYPE } from '../../reducers/slider-list'

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MidiSettings)

const { BUTTON, BUTTON_TOGGLE, PAGE } = STRIP_TYPE

MidiSettings.propTypes = {
  actions: PropTypes.object,
  initApp: PropTypes.func,
  inputs: PropTypes.object,
  isSettingsMode: PropTypes.bool,
  lastFocusedPage: PropTypes.string,
  onClose: PropTypes.func,
  outputs: PropTypes.object,
  pageTarget: PropTypes.object,
  sliderEntry: PropTypes.object
}

function MidiSettings(props) {
  const theme = useTheme()
  const classes = makeStyles(styles.bind(this, theme))()
  const {
    isSettingsMode,
    actions,
    initApp,
    inputs = {},
    outputs = {},
    sliderEntry = {},
    pageTarget = {},
    lastFocusedPage,
    onClose = () => {}
  } = props
  const { i, label, type } = sliderEntry
  const isOutputsEmpty = isAllEmpty(outputs)
  const isInputsEmpty = isAllEmpty(inputs)
  return (
    <div className={classes.root}>
      <MidiSettingsLabelInput
        classes={classes}
        label={type === undefined ? pageTarget.label : label}
        i={i}
        lastFocusedPage={lastFocusedPage}
        actions={actions}
        type={type}
      />
      {type === undefined && isSettingsMode && (
        <DriverExpansionPanel label='View' isEmpty={false}>
          <MidiSettingsView
            pageTarget={pageTarget}
            classes={classes}
            actions={actions}
            type={PAGE}
          />
        </DriverExpansionPanel>
      )}
      {type !== undefined && (
        <DriverExpansionPanel
          label={type === STRIP_TYPE.XYPAD ? 'Outputs X' : 'Outputs'}
          isEmpty={isOutputsEmpty}
        >
          {isOutputsEmpty ? (
            <DriverEmtpyRedirectButton actions={actions} i={i} />
          ) : (
            <MidiSettingsOutput
              classes={classes}
              sliderEntry={sliderEntry}
              outputs={outputs}
              actions={actions}
              lastFocusedPage={lastFocusedPage}
            />
          )}
        </DriverExpansionPanel>
      )}
      {type === STRIP_TYPE.XYPAD && (
        <DriverExpansionPanel label={'Outputs Y'} isEmpty={isOutputsEmpty}>
          {isOutputsEmpty ? (
            <DriverEmtpyRedirectButton actions={actions} i={i} />
          ) : (
            <MidiSettingsOutputY
              classes={classes}
              sliderEntry={sliderEntry}
              outputs={outputs}
              actions={actions}
              lastFocusedPage={lastFocusedPage}
            />
          )}
        </DriverExpansionPanel>
      )}
      {type !== undefined ? (
        <React.Fragment>
          {' '}
          <DriverExpansionPanel label={'Inputs'} isEmpty={isInputsEmpty}>
            {isInputsEmpty ? (
              <DriverEmtpyRedirectButton actions={actions} i={i} />
            ) : (
              <MidiSettingsInput
                classes={classes}
                sliderEntry={sliderEntry}
                inputs={inputs}
                actions={actions}
                lastFocusedPage={lastFocusedPage}
                initApp={initApp}
              />
            )}
          </DriverExpansionPanel>
          <DriverExpansionPanel label='View' isEmpty={false}>
            <MidiSettingsView
              sliderEntry={sliderEntry}
              classes={classes}
              actions={actions}
            />
          </DriverExpansionPanel>
          <Tooltip title='Clone'>
            <Button
              className={classes.button}
              variant='contained'
              onClick={actions.clone.bind(this, sliderEntry)}
            >
              <CopyIcon className={classes.iconColor} />
            </Button>
          </Tooltip>
        </React.Fragment>
      ) : null}

      <DeleteModal
        asButton
        isOpen={false}
        sliderEntry={sliderEntry}
        onClose={onClose}
        actions={actions}
      />
    </div>
  )
}

function styles(theme) {
  return {
    root: {
      display: 'flex',
      flexDirection: 'column'
    },

    button: {
      margin: theme.spacing(1),
      background: theme.palette.button.background
    },

    iconColor: {
      color: theme.palette.primary.contrastText,
      cursor: 'pointer'
    },

    inputInput: {
      margin: theme.spacing(1)
    },

    select: {
      color: theme.palette.primary.contrastText,
      lineHeight: '1.375em'
    }
  }
}

function hasContent(arr) {
  return Array.isArray(arr) && arr.length > 0
}

function isAllEmpty(obj) {
  let ret = true
  Object.keys(obj).forEach((name, idx) => {
    const { ccChannels, noteChannels } = obj[name]
    if (hasContent(ccChannels) || hasContent(noteChannels)) {
      ret = false
    }
  })
  return ret
}

export function renderMidiChannelSelection({ inputs, outputs }, name, type) {
  const puts = inputs || outputs
  const { ccChannels, noteChannels } = puts[name] || 'None'
  let channels = ccChannels || []
  if ([BUTTON, BUTTON_TOGGLE].includes(type)) {
    channels = noteChannels
  }
  if (!channels) {
    return getItem('None', 0)
  }
  return channels.map((name, idx) => getItem(name, idx))
}

export function renderDriverSelection({ inputs, outputs }) {
  let ret = []
  const puts = inputs || outputs
  Object.keys(puts).forEach((name, idx) => {
    const { ccChannels, noteChannels } = puts[name]
    if (hasContent(ccChannels) || hasContent(noteChannels)) {
      ret.push(
        <MenuItem key={`driver-${idx}`} value={name}>
          {name}
        </MenuItem>
      )
    }
  })

  ret.push(getItem('None'))
  return ret
}

function getItem(name, idx) {
  return (
    <MenuItem key={`input-channel-${idx}`} value={name}>
      {name}
    </MenuItem>
  )
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...MidiSliderActions, ...ViewActions },
      dispatch
    ),
    initApp: bindActionCreators(initApp, dispatch)
  }
}

function mapStateToProps({
  viewSettings: {
    lastFocusedPage,
    isSettingsMode,
    pageTargets = [],
    availableDrivers: { inputs = {}, outputs = {} } = {}
  }
}) {
  const pageTarget = pageTargets.find((item) => item.id === lastFocusedPage)
  return {
    lastFocusedPage,
    isSettingsMode,
    pageTarget,
    inputs,
    outputs
  }
}
