import React from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import { withStyles } from '@material-ui/core/styles'

import MidiNoteInput from './MidiNoteInput'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../../actions/slider-list.js'
import { STRIP_TYPE } from '../../../../reducers/slider-list'
import { midi, Note } from 'tonal'

class InputNoteOrCc extends React.Component {
  state = {
    noteVal: 'C4'
  }
  constructor (props) {
    super(props)
    this.state = {
      noteVal: Note.fromMidi(props.sliderEntry.midiCC)
    }
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

        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <FormControl className={classes.formControl}>
            <InputLabel className={classes.label} htmlFor='note'>Note</InputLabel>
            <MidiNoteInput sliderEntry={sliderEntry} idx={idx} />
          </FormControl>
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
    margin: theme.spacing.unit
  },
  label: {
    color: theme.palette.primary.contrastText,
    marginBottom: theme.spacing.unit * 2
  },
  input: {
    // margin: theme.spacing.unit,
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
