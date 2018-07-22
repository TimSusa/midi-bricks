import React from 'react'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteIcon from '@material-ui/icons/Delete'
import { withStyles } from '@material-ui/core/styles'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../../actions/slider-list.js'
import InputNoteOrCc from './InputNoteOrCc'
import { STRIP_TYPE } from '../../../../reducers/slider-list'
import {Chord} from 'tonal'

class ExpandedStrip extends React.Component {
  render () {
    const { sliderEntry, idx, classes } = this.props
    return (
      <React.Fragment>
        <InputNoteOrCc sliderEntry={sliderEntry} idx={idx} />

        <br />

        <Tooltip
          placement='right'
          title={this.getSelectedDriverName(sliderEntry)}
        >
          <FormControl className={classes.formControl}>
            <InputLabel className={classes.label} htmlFor='cc'>Driver </InputLabel>
            <Select
              className={classes.select}
              onChange={e => this.props.actions.selectSliderMidiDriver({
                idx,
                val: e.target.value
              })}
              value={sliderEntry.outputId}>
              {this.renderDriverSelection(sliderEntry.midi.midiDrivers)}
            </Select>
          </FormControl>
        </Tooltip>

        <Tooltip
          placement='right'
          title='You can set the MIDI Channel here.'
        >
          <FormControl className={classes.formControl}>
            <InputLabel className={classes.label} htmlFor='cc'>Channel </InputLabel>
            <Input
              className={classes.input}
              id='number'
              type='number'
              name={`input-channel-name-${idx}`}
              value={sliderEntry.midiChannel}
              onChange={e => this.props.actions.selectMidiChannel({ idx, val: e.target.value })} />
          </FormControl>
        </Tooltip>

        <br />

        {
          sliderEntry.type === STRIP_TYPE.BUTTON &&
          <Tooltip
            placement='right'
            title='Select a Chord'
          >
            <FormControl className={classes.formControl}>
              <InputLabel className={classes.label} htmlFor='chord'>Chord </InputLabel>
              <Select
                className={classes.select}
                onChange={e => this.props.actions.setChord({
                  idx,
                  val: e.target.value
                })}
                value={sliderEntry.chord}
              >
                {this.renderChordSelection()}
              </Select>
            </FormControl>
          </Tooltip>

        }
        <br />

        <Tooltip
          placement='right'
          title='Remove MIDI Channel Strip'
        >
          <Button
            className={classes.button}
            variant='raised'
            onClick={this.props.actions.deleteSlider.bind(this, idx)}>
            <DeleteIcon className={classes.iconColor} />
          </Button>
        </Tooltip>
      </React.Fragment>
    )
  }
  getSelectedDriverName = (sliderEntry) => {
    const { outputId, midi } = sliderEntry
    const drivers = midi.midiDrivers
    let name = ''
    drivers.forEach(t => {
      if (t.outputId === outputId) {
        name = t.name
      }
    })
    return name
  }

  renderDriverSelection = (availableDrivers) => {
    return availableDrivers.map((item, idx) => {
      return (
        <MenuItem
          key={`driver-${idx}`}
          value={item.outputId}
        >
          {item.name}
        </MenuItem>
      )
    })
  }

  renderChordSelection = () => {
    let chordNames = Chord.names()
    chordNames.unshift('none')
    return chordNames.map((item, idx) => {
      return (
        <MenuItem
          key={`chords-${idx}`}
          value={item}
        >
          {item}
        </MenuItem>
      )
    })
  }
}

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    background: theme.palette.secondary.light
  },
  iconColor: {
    color: theme.palette.primary.contrastText,
    cursor: 'pointer'
  },
  input: {
    width: 80,
    margin: theme.spacing.unit,
    color: theme.palette.primary.contrastText, // 'rgba(0, 0, 0, 0.54)',
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em'
  },
  formControl: {
    margin: theme.spacing.unit,
    maxWidth: 100
  },
  label: {
    color: theme.palette.primary.contrastText
  },
  select: {
    width: 80,
    color: theme.palette.primary.contrastText,
    lineHeight: '1.375em'
  }
})

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}

export default (withStyles(styles)(connect(null, mapDispatchToProps)(ExpandedStrip)))
