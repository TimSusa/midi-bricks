import React from 'react'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import Tooltip from '@material-ui/core/Tooltip'
import CopyIcon from '@material-ui/icons/NoteAdd'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {Actions as MidiSliderActions} from '../../../../../actions/slider-list.js'
import {Actions as ViewActions}from '../../../../../actions/view-settings.js'
import DeleteModal from '../../../../DeleteModal'
import DriverExpansionPanel from '../../../../DriverExpansionPanel'
import MidiSettingsInput from './elements/MidiSettingsInput'
import { MidiSettingsLabelInput } from './elements/MidiSettingsLabelInput'
import { MidiSettingsOutput } from './elements/MidiSettingsOutput'
import { MidiSettingsOutputY } from './elements/MidiSettingsOutputY'
import { MidiSettingsView } from './elements/MidiSettingsView'
import { DriverEmtpyRedirectButton } from './elements/DriverEmtpyRedirectButton'

import { STRIP_TYPE } from '../../../../../reducers/slider-list'

const { BUTTON, BUTTON_TOGGLE } = STRIP_TYPE

const MidiSettings = props => {
  const {
    actions,
    inputs = {},
    outputs = {},
    sliderEntry,
    sliderEntry: { i, label, type },
    idx,
    classes,
    onClose,
  } = props

  const isOutputsEmpty = isAllEmpty(outputs)
  const isInputsEmpty = isAllEmpty(inputs)

  return (
    <div className={classes.root}>
      <MidiSettingsLabelInput
        classes={classes}
        idx={idx}
        label={label}
        i={i}
        actions={actions}
        type={type}
      />

      {type !== STRIP_TYPE.PAGE ? (
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
            />
          )}
        </DriverExpansionPanel>
      ) : null}
      {type === STRIP_TYPE.XYPAD ? (
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
            />
          )}
        </DriverExpansionPanel>
      ) : null}
      {type !== STRIP_TYPE.XYPAD ? (
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
          <DriverExpansionPanel label="View" isEmpty={false}>
            <MidiSettingsView
              sliderEntry={sliderEntry}
              classes={classes}
              actions={actions}
            />
          </DriverExpansionPanel>
        </React.Fragment>
      ) : null}

      <Tooltip title="Clone">
        <Button
          className={classes.button}
          variant="contained"
          onClick={actions.clone.bind(this, sliderEntry)}
        >
          <CopyIcon className={classes.iconColor} />
        </Button>
      </Tooltip>

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

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  // expPanel: {
  //   margin: theme.spacing.unit,
  //   minHeight: theme.spacing.unit * 8,
  // },
  button: {
    margin: theme.spacing.unit,
    background: theme.palette.button.background,
  },
  // heading: {
  //   margin: theme.spacing.unit,
  //   color: theme.palette.primary.contrastText,
  // },
  iconColor: {
    color: theme.palette.primary.contrastText,
    cursor: 'pointer',
  },
  input: {
    color: theme.palette.primary.contrastText, // 'rgba(0, 0, 0, 0.54)',
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em',
  },
  inputInput: {
    margin: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit,
  },
  label: {
    color: theme.palette.primary.contrastText,
  },
  select: {
    color: theme.palette.primary.contrastText,
    lineHeight: '1.375em',
  },
})

const hasContent = arr => Array.isArray(arr) && arr.length > 0

const isAllEmpty = obj => {
  let ret = true
  Object.keys(obj).forEach((name, idx) => {
    const { ccChannels, noteChannels } = obj[name]
    if (hasContent(ccChannels) || hasContent(noteChannels)) {
      ret = false
    }
  })
  return ret
}

export const renderMidiChannelSelection = ({ inputs, outputs }, name, type) => {
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

export const renderDriverSelection = ({ inputs, outputs }) => {
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

const getItem = (name, idx) => (
  <MenuItem key={`input-channel-${idx}`} value={name}>
    {name}
  </MenuItem>
)

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...MidiSliderActions, ...ViewActions },
      dispatch
    ),
  }
}

function mapStateToProps({
  viewSettings: { availableDrivers: { inputs = {}, outputs = {} } = {} },
  sliders: { sliderList },
}) {
  return {
    sliderList,
    inputs,
    outputs,
  }
}

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MidiSettings)
)
