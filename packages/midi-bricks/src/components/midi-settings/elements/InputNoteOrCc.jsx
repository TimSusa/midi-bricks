import React from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as MidiSliderActions } from '../../../actions/slider-list.js'
import { STRIP_TYPE } from '../../../reducers/slider-list.js'
import MidiSuggestedInput from './MidiSuggestedInput'
import { fromMidi } from '../../../utils/fromMidi'
import { midi } from 'tonal'
import { Input } from '@material-ui/core'

const InputNoteOrCc = props => {
  const {
    midiCC,
    yMidiCc,
    type,
    idx,
    classes,
    actions: { selectCc },
  } = props
  const isCcInput = [
    STRIP_TYPE.SLIDER,
    STRIP_TYPE.SLIDER_HORZ,
    STRIP_TYPE.BUTTON_CC,
    STRIP_TYPE.BUTTON_TOGGLE_CC,
  ].includes(type)

  if ([STRIP_TYPE.LABEL, STRIP_TYPE.PAGE].includes(type)) {
    return <div />
  }

  if (isCcInput) {
    return (
      <FormControl className={classes.formControl}>
        <InputLabel className={classes.label} htmlFor="cc">
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
        <InputLabel className={classes.label} htmlFor="cc">
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
        <InputLabel className={classes.label} htmlFor="prgChange">
          Program Change
        </InputLabel>
        <Input
          className={classes.input}
          id="number"
          type="number"
          name={`input-prgChange-name-${idx}`}
          value={midiCC[0] || 0}
          onChange={handleProgramChange.bind(this, idx, selectCc)}
        />
      </FormControl>
    )
  } else {
    return (
      <FormControl className={classes.formControl}>
        <InputLabel className={classes.label} htmlFor="note">
          Notes
        </InputLabel>
        <MidiSuggestedInput
          suggestions={[...suggestionsMidiNoteCC, ...suggestionsMidiNote]}
          startVal={midiCC.map(item => fromMidi(midi(item)))}
          idx={idx}
          handleChange={selectCc}
        />
      </FormControl>
    )
  }
}

const handleProgramChange = (idx, selectCc, e) => {
  selectCc({
    idx,
    val: [parseInt(e.target.value, 10)],
  })
}

const suggestionsMidiNote = Array.apply(null, { length: 128 })
  .map(Number.call, Number)
  .map(item => {
    return {
      label: fromMidi(item, true),
    }
  })

const suggestionsMidiNoteCC = Array.apply(null, { length: 128 })
  .map(Number.call, Number)
  .map(item => {
    return {
      label: `${item}`,
    }
  })

const suggestionsMidiCc = Array.apply(null, { length: 120 })
  .map(Number.call, Number)
  .map(item => {
    return { label: `${item}` }
  })

const styles = theme => ({
  formControl: {
    margin: theme.spacing(1),
  },
  label: {
    color: theme.palette.primary.contrastText,
    marginBottom: theme.spacing(2),
  },
  input: {
    color: theme.palette.primary.contrastText, // 'rgba(0, 0, 0, 0.54)',
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em',
  },
})

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch),
  }
}

export default withStyles(styles)(
  connect(
    null,
    mapDispatchToProps
  )(InputNoteOrCc)
)

function selectCcY(props, e) {
  console.log(e)
  props.actions.changeXypadSettings({
    i: props.i,
    yMidiCc: e.val,
  })
}
