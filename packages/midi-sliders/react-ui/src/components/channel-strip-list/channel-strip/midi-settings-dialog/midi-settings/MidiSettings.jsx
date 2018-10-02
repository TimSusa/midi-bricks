import React from 'react'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import Tooltip from '@material-ui/core/Tooltip'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import CopyIcon from '@material-ui/icons/NoteAdd'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../../../actions/slider-list.js'
import { STRIP_TYPE } from '../../../../../reducers/slider-list.js'
import InputNoteOrCc from './elements/InputNoteOrCc'
import DeleteModal from '../../../../DeleteModal'
import ColorModal from './elements/ColorModal'
import MidiSuggestedInput from './elements/MidiSuggestedInput'

class MidiSettings extends React.Component {
  render () {
    const { sliderEntry, idx, classes } = this.props
    return (
      <div
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <FormControl
          className={classes.formControl}
        >
          <InputLabel
            className={classes.label}
            htmlFor='label'
          >
            Label
          </InputLabel>
          <Input
            className={classes.input}
            id='label'
            type='label'
            name={`input-label-name-${idx}`}
            value={sliderEntry.label}
            onChange={this.handleLabelChange.bind(this, idx)}
            autoFocus
          />
        </FormControl>

        {
          (sliderEntry.type !== STRIP_TYPE.LABEL) ? (
            <React.Fragment>
              <InputNoteOrCc
                sliderEntry={sliderEntry}
                idx={idx}
              />
              <br />
              <FormControl
                className={classes.formControl}
              >
                <InputLabel
                  className={classes.label}
                  htmlFor='cc'>
                  Driver
                </InputLabel>
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
            </React.Fragment>
          ) : (
            <div />
          )
        }

        <br />
        {
          (sliderEntry.type !== STRIP_TYPE.SLIDER) ? (
            <React.Fragment>
              <FormControl className={classes.formControl}>
                {[
                  STRIP_TYPE.BUTTON,
                  STRIP_TYPE.BUTTON_CC,
                  STRIP_TYPE.BUTTON_TOGGLE,
                  STRIP_TYPE.BUTTON_TOGGLE_CC
                ].includes(sliderEntry.type) &&
                  (
                    <React.Fragment>
                      <InputLabel
                        className={classes.label}
                        htmlFor='button-type'
                      >
                        Type
                      </InputLabel>
                      <Select
                        className={classes.select}
                        onChange={this.handleButtonTypeChange.bind(this, idx)}
                        value={sliderEntry.type}
                      >
                        {this.renderButtonTypeSelection()}
                      </Select>
                    </React.Fragment>
                  )}

                <ColorModal
                  title='Background'
                  sliderEntry={sliderEntry}
                  idx={idx}
                  fieldName='color'
                  color={sliderEntry.colors.color}
                />
                <ColorModal
                  title='Font-Color'
                  sliderEntry={sliderEntry}
                  idx={idx}
                  fieldName='colorFont'
                  color={sliderEntry.colors.colorFont}
                />
                <ColorModal
                  title='Activated State'
                  sliderEntry={sliderEntry}
                  idx={idx}
                  fieldName='colorActive'
                  color={sliderEntry.colors.colorActive}
                />
                <ColorModal
                  title='Font-Color Activated'
                  sliderEntry={sliderEntry}
                  idx={idx}
                  fieldName='colorFontActive'
                  color={sliderEntry.colors.colorFontActive}
                />
              </FormControl>
              <FormControl>
                <InputLabel
                  className={classes.label}
                  htmlFor='cc'
                >
                  Listen to CC
                </InputLabel>
                <MidiSuggestedInput
                  suggestions={this.suggestionsMidiCc}
                  startVal={sliderEntry.listenToCc || []}
                  sliderEntry={sliderEntry}
                  idx={idx}
                  handleChange={this.props.actions.addMidiCcListener}
                />
              </FormControl>
            </React.Fragment>
          ) : (
            <div />
          )
        }
        <Tooltip
          title='Clone'>
          <Button
            className={classes.button}
            variant='raised'
            onClick={this.props.actions.clone.bind(this, idx)}
          >
            <CopyIcon className={classes.iconColor} />
          </Button>
        </Tooltip>

        <DeleteModal
          asButton
          isOpen={false}
          sliderEntry={sliderEntry}
          idx={idx}
          onAction={this.props.actions.delete}
          onClose={this.props.onClose}
        />

      </div>
    )
  }

  suggestionsMidiCc =
    Array
      .apply(null, { length: 128 })
      .map(Number.call, Number)
      .map((item) => {
        return { label: `${item}` }
      })

  handleLabelChange = (idx, e, val) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.actions.changeLabel({
      idx,
      val: e.target.value
    })
  }

  handleButtonTypeChange = (idx, e) => {
    this.props.actions.changeButtonType({
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

  renderButtonTypeSelection = () => {
    const { type } = this.props.sliderEntry
    const isCC = type.endsWith('_CC')
    if (isCC) {
      return (
        [STRIP_TYPE.BUTTON_CC, STRIP_TYPE.BUTTON_TOGGLE_CC].map((item, btnIdx) => {
          return (
            <MenuItem
              key={`button-type-cc-${btnIdx}`}
              value={item}
            >
              {item}
            </MenuItem>
          )
        })
      )
    } else {
      return (
        [STRIP_TYPE.BUTTON, STRIP_TYPE.BUTTON_TOGGLE].map((item, btnIdx) => {
          return (
            <MenuItem
              key={`button-type-${btnIdx}`}
              value={item}
            >
              {item}
            </MenuItem>
          )
        })
      )
    }
  }
}

const styles = theme => ({
  button: {
    margin: '16px 0 16px 0',
    background: theme.palette.button.background
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

export default (withStyles(styles)(connect(null, mapDispatchToProps)(MidiSettings)))
