import React from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../../../../actions/slider-list.js'
import { STRIP_TYPE } from '../../../../../../reducers/slider-list.js'
import MidiSuggestedInput from './MidiSuggestedInput'
import { Note, midi } from 'tonal'

class InputNoteOrCc extends React.Component {
  render () {
    const { sliderEntry, idx, classes, actions: { selectCc } } = this.props
    const isCcInput = [
      STRIP_TYPE.SLIDER,
      STRIP_TYPE.SLIDER_HORZ,
      STRIP_TYPE.BUTTON_CC,
      STRIP_TYPE.BUTTON_TOGGLE_CC
    ].includes(sliderEntry.type)

    if ([STRIP_TYPE.LABEL, STRIP_TYPE.PAGE].includes(sliderEntry.type)) {
      return (<div />)
    }
    if (isCcInput) {
      return (
        <FormControl className={classes.formControl}>
          <InputLabel
            className={classes.label}
            htmlFor='cc'
          >CC
          </InputLabel>
          <MidiSuggestedInput
            suggestions={this.suggestionsMidiCc}
            startVal={sliderEntry.midiCC}
            sliderEntry={sliderEntry}
            idx={idx}
            handleChange={selectCc}
          />
        </FormControl>
      )
    } else {
      return (
        <FormControl className={classes.formControl}>
          <InputLabel
            className={classes.label}
            htmlFor='note'
          >
            Notes
          </InputLabel>
          <MidiSuggestedInput
            suggestions={this.suggestionsMidiNote}
            startVal={sliderEntry.midiCC.map((item) => Note.fromMidi(midi(item)))}
            sliderEntry={sliderEntry}
            idx={idx}
            handleChange={selectCc}
          />
        </FormControl>
      )
    }
  }

  suggestionsMidiNote = Array.apply(null, { length: 128 }).map(Number.call, Number).map((item) => {
    return { label: Note.fromMidi(item) }
  })

  suggestionsMidiCc = Array.apply(null, { length: 128 }).map(Number.call, Number).map((item) => {
    return { label: `${item}` }
  })
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
