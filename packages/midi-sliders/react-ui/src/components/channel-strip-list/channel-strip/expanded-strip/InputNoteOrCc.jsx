import React from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Tooltip from '@material-ui/core/Tooltip'
import { withStyles } from '@material-ui/core/styles'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../../actions/slider-list.js'
import { STRIP_TYPE } from '../../../../reducers/slider-list'
import { midi, Note } from 'tonal'

class InputNoteOrCc extends React.Component {
  state = {
    noteVal: 'C4'
  }
  componentWillReceiveProps ({sliderEntry}) {
    this.setState({
      noteVal: Note.fromMidi(sliderEntry.midiCC)
    })
  }
  render () {
    const { sliderEntry, idx, classes } = this.props
    if (sliderEntry.type === STRIP_TYPE.SLIDER) {
      return (
        <React.Fragment>
          <Tooltip
            placement='right'
            title='You can set a CC Message here.'
          >
            <FormControl className={classes.formControl}>
              <InputLabel className={classes.label} htmlFor='cc'>CC</InputLabel>
              <Input
                className={classes.input}
                id='number'
                type='number'
                name={`input-cc-name-${idx}`}
                value={sliderEntry.midiCC}
                onChange={this.handleCCChange.bind(this, idx)} />

            </FormControl>
          </Tooltip>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <Tooltip
            placement='right'
            title='You can set a MIDI Note here. Please hit Enter after input.'
          >
            <FormControl className={classes.formControl}>
              <InputLabel className={classes.label} htmlFor='cc'>Note</InputLabel>
              <Input
                className={classes.input}
                id='cc-note'
                name={`input-cc-note-name-${idx}`}
                value={this.state.noteVal}
                onChange={this.handleNoteChange.bind(this, idx)}
                onKeyPress={this.sendNoteChange.bind(this, idx)}
              />
            </FormControl>
          </Tooltip>
        </React.Fragment>
      )
    }
  }
  handleCCChange = (idx, e) => {
    this.props.actions.selectCC({ idx, val: e.target.value })
    e.preventDefault()
  }
  handleNoteChange = (idx, e) => {
    this.setState({noteVal: e.target.value})
    e.preventDefault()
  }
  sendNoteChange = (idx, e) => {
    if (e.key === 'Enter') {
      this.props.actions.selectCC({ idx, val: midi(this.state.noteVal) })
      e.preventDefault()
    }
  }
}

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    maxWidth: 100
  },
  label: {
    color: theme.palette.primary.contrastText
  },
  input: {
    width: 80,
    margin: theme.spacing.unit,
    color: theme.palette.primary.contrastText, // 'rgba(0, 0, 0, 0.54)',
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em'
  }
})

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}

export default (withStyles(styles)(connect(null, mapDispatchToProps)(InputNoteOrCc)))
