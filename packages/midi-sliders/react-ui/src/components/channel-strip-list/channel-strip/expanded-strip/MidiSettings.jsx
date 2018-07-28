import React from 'react'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import DeleteIcon from '@material-ui/icons/Delete'
import { withStyles } from '@material-ui/core/styles'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../../actions/slider-list.js'
import InputNoteOrCc from './InputNoteOrCc'
import { STRIP_TYPE } from '../../../../reducers/slider-list'
import { Chord } from 'tonal'

class ExpandedStrips extends React.Component {
  render () {
    const { sliderEntry, idx, classes } = this.props
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <FormControl className={classes.formControl}>
          <InputLabel className={classes.label} htmlFor='label'>Label </InputLabel>
          <Input
            className={classes.input}
            id='label'
            type='label'
            name={`input-label-name-${idx}`}
            value={sliderEntry.label}
            onChange={this.handleLabelChange.bind(this, idx)}
          />
        </FormControl>

        <InputNoteOrCc sliderEntry={sliderEntry} idx={idx} />

        <br />

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

        <br />

        {
          sliderEntry.type === STRIP_TYPE.BUTTON &&
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

        }
        <br />

        <Button
          className={classes.button}
          variant='raised'
          onClick={this.props.actions.deleteSlider.bind(this, idx)}>
          <DeleteIcon className={classes.iconColor} />
        </Button>
      </div>
    )
  }

  handleLabelChange = (idx, e, val) => {
    this.props.actions.changeSliderLabel({
      idx,
      val: e.target.value
    })
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
    // margin: theme.spacing.unit,
    color: theme.palette.primary.contrastText, // 'rgba(0, 0, 0, 0.54)',
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em'
  },
  inputInput: {
    margin: theme.spacing.unit
  },
  formControl: {
    margin: theme.spacing.unit
  },
  label: {
    color: theme.palette.primary.contrastText
  },
  select: {
    color: theme.palette.primary.contrastText,
    lineHeight: '1.375em'
  }
})

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}

export default (withStyles(styles)(connect(null, mapDispatchToProps)(ExpandedStrips)))
