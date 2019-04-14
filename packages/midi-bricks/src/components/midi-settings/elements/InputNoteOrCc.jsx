import React from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as MidiSliderActions } from '../../../actions/slider-list.js'
import { STRIP_TYPE } from '../../../reducers/slider-list.js'
import MidiSuggestedInput from './MidiSuggestedInput'
import { fromMidi } from '../../../utils/fromMidi'
import { midi } from 'tonal'
import { Input } from '@material-ui/core'

const useStyles = makeStyles(styles, { useTheme: true })

InputNoteOrCc.propTypes = {
  idx: PropTypes.number,
  midiCC: PropTypes.array,
  type: PropTypes.string,
  yMidiCc: PropTypes.array
}

function InputNoteOrCc(props) {
  const classes = useStyles()
  const {
    midiCC,
    yMidiCc,
    type,
    idx,
    actions: { selectCc = () => {} }
  } = props
  const isCcInput = [
    STRIP_TYPE.SLIDER,
    STRIP_TYPE.SLIDER_HORZ,
    STRIP_TYPE.BUTTON_CC,
    STRIP_TYPE.BUTTON_TOGGLE_CC
  ].includes(type)

  if ([STRIP_TYPE.LABEL, STRIP_TYPE.PAGE].includes(type)) {
    return <div />
  }

  if (isCcInput) {
    return (
      <FormControl className={classes.formControl}>
        <InputLabel className={classes.label} htmlFor='cc'>
          CC
        </InputLabel>
        <MidiSuggestedInput
          suggestions={suggestionsMidiCc}
          startVal={midiCC}
          idx={idx}
          handleChange={selectCc}
        />
      </FormControl>
    )
  } else if (type === STRIP_TYPE.XYPAD) {
    return (
      <FormControl className={classes.formControl}>
        <InputLabel className={classes.label} htmlFor='cc'>
          CC
        </InputLabel>
        <MidiSuggestedInput
          suggestions={suggestionsMidiCc}
          startVal={yMidiCc}
          idx={idx}
          handleChange={selectCcY.bind(this, props)}
        />
      </FormControl>
    )
  } else if (type === STRIP_TYPE.BUTTON_PROGRAM_CHANGE) {
    return (
      <FormControl className={classes.formControl}>
        <InputLabel className={classes.label} htmlFor='prgChange'>
          Program Change
        </InputLabel>
        <Input
          className={classes.input}
          id='number'
          type='number'
          name={`input-prgChange-name-${idx}`}
          value={midiCC[0] || 0}
          onChange={handleProgramChange.bind(this, idx, selectCc)}
        />
      </FormControl>
    )
  } else {
    return (
      <FormControl className={classes.formControl}>
        <InputLabel className={classes.label} htmlFor='note'>
          Notes
        </InputLabel>
        <MidiSuggestedInput
          suggestions={[...suggestionsMidiNoteCC(), ...suggestionsMidiNote()]}
          startVal={midiCC.map((item) => fromMidi(midi(item)))}
          idx={idx}
          handleChange={selectCc}
        />
      </FormControl>
    )
  }
}



function handleProgramChange(idx, selectCc, e) {
  selectCc({
    idx,
    val: [parseInt(e.target.value, 10)]
  })
}

function suggestionsMidiNote() {
  return Array.apply(null, { length: 128 })
    .map(Number.call, Number)
    .map((item) => {
      return {
        label: fromMidi(item, true)
      }
    })
}

function suggestionsMidiNoteCC() {
  return Array.apply(null, { length: 128 })
    .map(Number.call, Number)
    .map((item) => {
      return {
        label: `${item}`
      }
    })
}

function suggestionsMidiCc() {
  return Array.apply(null, { length: 120 })
    .map(Number.call, Number)
    .map((item) => {
      return { label: `${item}` }
    })
}
function styles(theme) {
  return {
    formControl: {
      margin: theme.spacing(1)
    },
    label: {
      color: theme.palette.primary.contrastText,
      marginBottom: theme.spacing(2)
    },
    input: {
      color: theme.palette.primary.contrastText, // 'rgba(0, 0, 0, 0.54)',
      fontSize: '1rem',
      fontWeight: 400,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      lineHeight: '1.375em'
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}

export default connect(
  null,
  mapDispatchToProps
)(InputNoteOrCc)

function selectCcY(props, e) {
  props.actions.changeXypadSettings({
    i: props.i,
    yMidiCc: e.val
  })
}
