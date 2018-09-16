import React from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../../actions/slider-list.js'
import { STRIP_TYPE } from '../../../../reducers/slider-list'
import MidiSuggestedInput from './MidiSuggestedInput'
import { Note } from 'tonal'

class InputNoteOrCc extends React.Component {
  render () {
    const { sliderEntry, idx, classes } = this.props
    if (sliderEntry.type === STRIP_TYPE.LABEL) {
      return (<div />)
    }
    if (sliderEntry.type === STRIP_TYPE.SLIDER) {
      return (
        <React.Fragment>
          <FormControl className={classes.formControl}>
            <InputLabel className={classes.label} htmlFor='cc'>CC</InputLabel>
            <MidiSuggestedInput
              suggestions={this.suggestionsMidiCc}
              startVal={['65']}
              sliderEntry={sliderEntry}
              idx={idx}
            />
          </FormControl>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <FormControl className={classes.formControl}>
            <InputLabel className={classes.label} htmlFor='note'>Notes</InputLabel>
            <MidiSuggestedInput
              suggestions={this.suggestionsMidiNote}
              startVal={[Note.fromMidi(65)]}
              sliderEntry={sliderEntry}
              idx={idx}
            />
          </FormControl>
        </React.Fragment>
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
