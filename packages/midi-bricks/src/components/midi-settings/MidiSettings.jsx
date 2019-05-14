import React from 'react'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import Tooltip from '@material-ui/core/Tooltip'
import CopyIcon from '@material-ui/icons/NoteAdd'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { connect } from 'react-redux'
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

const { BUTTON, BUTTON_TOGGLE, PAGE } = STRIP_TYPE

MidiSettings.propTypes = {
  isSettingsMode: PropTypes.bool,
  actions: PropTypes.object,
  idx: PropTypes.number,
  inputs: PropTypes.object,
  onClose: PropTypes.func,
  outputs: PropTypes.object,
  sliderEntry: PropTypes.object,
  pageTarget: PropTypes.object,
  lastFocusedPage: PropTypes.string
}

function MidiSettings(props) {
  const classes = makeStyles(styles, { withTheme: true })()
  const {
    isSettingsMode,
    actions,
    inputs = {},
    outputs = {},
    sliderEntry = {},
    pageTarget = {},
    sliderEntry: { i, label, type },
    idx,
    lastFocusedPage,
    onClose = () => {}
  } = props

  const isOutputsEmpty = isAllEmpty(outputs)
  const isInputsEmpty = isAllEmpty(inputs)
  return (
    <div className={classes.root}>
      <MidiSettingsLabelInput
        classes={classes}
        idx={idx}
        label={(type === undefined) ? pageTarget.label : label}
        i={i}
        actions={actions}
        type={type}
      />
      {(type === undefined && isSettingsMode) && (
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
              idx={idx}
              outputs={outputs}
              actions={actions}
              lastFocusedPage={lastFocusedPage}
            />
          )}
        </DriverExpansionPanel>
      ) }
      {type === STRIP_TYPE.XYPAD && (
        <DriverExpansionPanel label={'Outputs Y'} isEmpty={isOutputsEmpty}>
          {isOutputsEmpty ? (
            <DriverEmtpyRedirectButton actions={actions} i={i} />
          ) : (
            <MidiSettingsOutputY
              classes={classes}
              sliderEntry={sliderEntry}
              idx={idx}
              outputs={outputs}
              actions={actions}
              lastFocusedPage={lastFocusedPage}
            />
          )}
        </DriverExpansionPanel>
      ) }
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
                idx={idx}
                inputs={inputs}
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
        idx={idx}
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
    // expPanel: {
    //   margin: theme.spacing(1),
    //   minHeight: theme.spacing(8),
    // },
    button: {
      margin: theme.spacing(1),
      background: theme.palette.button.background
    },
    // heading: {
    //   margin: theme.spacing(1),
    //   color: theme.palette.primary.contrastText,
    // },
    iconColor: {
      color: theme.palette.primary.contrastText,
      cursor: 'pointer'
    },
    // input: {
    //   color: theme.palette.primary.contrastText, // 'rgba(0, 0, 0, 0.54)',
    //   fontSize: '1rem',
    //   fontWeight: 400,
    //   fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    //   lineHeight: '1.375em',
    // },
    inputInput: {
      margin: theme.spacing(1)
    },
    // formControl: {
    //   margin: theme.spacing(1),
    // },
    // label: {
    //   color: theme.palette.primary.contrastText,
    // },
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
    )
  }
}

function mapStateToProps({
  viewSettings: { lastFocusedPage, isSettingsMode, pageTargets, availableDrivers: { inputs = {}, outputs = {} } = {} },
  sliders: { sliderList }
}) {
  const pageTarget = pageTargets.find(item => item.id === lastFocusedPage)
  return {
    lastFocusedPage,
    isSettingsMode,
    sliderList,
    pageTarget,
    inputs,
    outputs
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MidiSettings)
