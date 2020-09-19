import React from 'react'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import Tooltip from '@material-ui/core/Tooltip'
import CopyIcon from '@material-ui/icons/NoteAdd'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/styles'
import { useDispatch, useSelector } from 'react-redux'

import { Actions as MidiSliderActions } from '../../global-state/actions/slider-list.js'
import DeleteModal from '../DeleteModal'
import DriverExpansionPanel from '../DriverExpansionPanel'
import MidiSettingsInput from './elements/MidiSettingsInput'
import { MidiSettingsLabelInput } from './elements/MidiSettingsLabelInput'
import { MidiSettingsOutput } from './elements/MidiSettingsOutput'
import { MidiSettingsView } from './elements/MidiSettingsView'
import { DriverEmtpyRedirectButton } from './elements/DriverEmtpyRedirectButton'

import { STRIP_TYPE } from '../../global-state/reducers/slider-list'

const { clone } = {
  ...MidiSliderActions
}

export default MidiSettings

const { BUTTON, BUTTON_TOGGLE, PAGE } = STRIP_TYPE

MidiSettings.propTypes = {
  inputs: PropTypes.object,
  isSettingsMode: PropTypes.bool,
  lastFocusedPage: PropTypes.string,
  onClose: PropTypes.func,
  outputs: PropTypes.object,
  pageTarget: PropTypes.object,
  sliderEntry: PropTypes.object
}

function MidiSettings(props) {
  const dispatch = useDispatch()
  const {
    lastFocusedPage,
    isSettingsMode,
    pageTargets = [],
    availableDrivers: { inputs = {}, outputs = {} } = {}
  } = useSelector((state) => state.viewSettings)
  const pageTarget = pageTargets.find((item) => item.id === lastFocusedPage)
  const theme = useTheme()
  const classes = makeStyles(styles.bind(this, theme))()
  const { sliderEntry = {}, onClose = () => {} } = props
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
        type={type}
      />
      {type === undefined && isSettingsMode && (
        <DriverExpansionPanel label='View' isEmpty={false}>
          <MidiSettingsView
            pageTarget={pageTarget}
            classes={classes}
            type={PAGE}
          />
        </DriverExpansionPanel>
      )}
      {type !== undefined && (
        <DriverExpansionPanel label={'Outputs'} isEmpty={isOutputsEmpty}>
          {isOutputsEmpty ? (
            <DriverEmtpyRedirectButton i={i} />
          ) : (
            <MidiSettingsOutput
              classes={classes}
              sliderEntry={sliderEntry}
              outputs={outputs}
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
              <DriverEmtpyRedirectButton i={i} />
            ) : (
              <MidiSettingsInput
                classes={classes}
                sliderEntry={sliderEntry}
                inputs={inputs}
                lastFocusedPage={lastFocusedPage}
              />
            )}
          </DriverExpansionPanel>
          <DriverExpansionPanel label='View' isEmpty={false}>
            <MidiSettingsView sliderEntry={sliderEntry} classes={classes} />
          </DriverExpansionPanel>
          <Tooltip title='Clone'>
            <Button
              className={classes.button}
              variant='contained'
              onClick={() => dispatch(clone(sliderEntry))}
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
  Object.keys(obj).forEach((name) => {
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
  return channels.map((namee, idx) => getItem(namee, idx))
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
