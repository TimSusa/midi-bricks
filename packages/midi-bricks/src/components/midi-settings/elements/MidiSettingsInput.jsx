import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { initApp } from '../../../actions/init.js'
import { Actions as MidiSliderActions } from '../../../actions/slider-list.js'
import { Actions as ViewActions } from '../../../actions/view-settings.js'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MidiSuggestedInput from './MidiSuggestedInput'
import {
  renderDriverSelection,
  renderMidiChannelSelection
} from '../MidiSettings'
import { suggestionsMidiCc } from './suggestions'

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MidiSettingsInput)

MidiSettingsInput.propTypes = {
  sliderEntry: PropTypes.object,
  actions: PropTypes.object,
  classes: PropTypes.object,
  idx: PropTypes.number,
  initApp: PropTypes.func,
  inputs: PropTypes.object,
  lastFocusedPage: PropTypes.string
}

function MidiSettingsInput(props) {
  const {
    sliderEntry: {
      i,
      type,
      driverNameInput = 'None',
      midiChannelInput,
      listenToCc
    },
    idx,
    lastFocusedPage,
    inputs,
    classes,
    initApp,
    actions
  } = props

  return (
    <React.Fragment>
      <FormControl>
        <InputLabel className={classes.label} htmlFor='cc'>
          Listen to CC
        </InputLabel>
        <MidiSuggestedInput
          suggestions={suggestionsMidiCc()}
          startVal={listenToCc || []}
          idx={idx}
          handleChange={handleAddCCListener.bind(this, actions, initApp)}
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel className={classes.label} htmlFor='midi-driver'>
          Driver
        </InputLabel>
        <Select
          className={classes.select}
          onChange={(e) =>
            actions.selectMidiDriverInput({
              i,
              driverNameInput: e.target.value,
              lastFocusedPage
            })
          }
          value={driverNameInput}
        >
          {renderDriverSelection({
            inputs
          })}
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel className={classes.label} htmlFor='input-ch-input'>
          Input Channel
        </InputLabel>
        <Select
          className={classes.select}
          onChange={(e) =>
            actions.selectMidiChannelInput({
              idx,
              val: e.target.value
            })
          }
          value={midiChannelInput || 'None'}
        >
          {renderMidiChannelSelection(
            {
              inputs
            },
            driverNameInput,
            type
          )}
        </Select>
      </FormControl>
    </React.Fragment>
  )
}

async function handleAddCCListener(actions, initApp, e) {
  actions.addMidiCcListener(e)
  await initApp()
}

function mapStateToProps({ viewSettings: { lastFocusedPage } }) {
  return {
    lastFocusedPage
  }
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
