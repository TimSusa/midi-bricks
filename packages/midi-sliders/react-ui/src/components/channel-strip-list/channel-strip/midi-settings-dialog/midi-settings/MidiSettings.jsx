import React from 'react'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import Tooltip from '@material-ui/core/Tooltip'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import CopyIcon from '@material-ui/icons/NoteAdd'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../../../actions/slider-list.js'
import * as ViewActions from '../../../../../actions/view-settings.js'
import InputNoteOrCc from './elements/InputNoteOrCc'
import DeleteModal from '../../../../DeleteModal'
import ColorModal from './elements/ColorModal'
import MidiSuggestedInput from './elements/MidiSuggestedInput'

import { STRIP_TYPE } from '../../../../../reducers/slider-list.js'
import { Typography } from '@material-ui/core'

const {
  BUTTON,
  BUTTON_CC,
  BUTTON_TOGGLE,
  BUTTON_TOGGLE_CC,
  SLIDER,
  SLIDER_HORZ,
  PAGE,
  LABEL
} = STRIP_TYPE

class MidiSettings extends React.PureComponent {
  render () {
    const {
      sliderEntry,
      sliderEntry: {
        i,
        label,
        type,
        colors,
        minVal,
        maxVal,
        onVal,
        offVal,
        outputId,
        midi,
        midiChannel,
        listenToCc,
        fontSize,
        fontWeight
      },
      idx,
      classes
    } = this.props
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
            value={label}
            onChange={this.handleLabelChange.bind(this, i, idx)}
            autoFocus
          />
        </FormControl>

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
              value={outputId}
            >
              {this.renderDriverSelection(midi.midiDrivers, type)}
            </Select>
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
              startVal={listenToCc || []}
              sliderEntry={sliderEntry}
              idx={idx}
              handleChange={this.handleAddCCListener}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel className={classes.label} htmlFor='cc'>Channel </InputLabel>
            <Input
              className={classes.input}
              id='number'
              type='number'
              name={`input-channel-name-${idx}`}
              value={midiChannel}
              onChange={e => this.props.actions.selectMidiChannel({ idx, val: e.target.value })} />
          </FormControl>
        </React.Fragment>

        <br />
        {
          (![SLIDER, SLIDER_HORZ].includes(type)) ? (
            <React.Fragment>
              <FormControl className={classes.formControl}>
                {[
                  BUTTON,
                  BUTTON_CC,
                  BUTTON_TOGGLE,
                  BUTTON_TOGGLE_CC
                ].includes(type) &&
                  (
                    <React.Fragment>

                      <FormControl className={classes.formControl}>
                        <InputLabel className={classes.label} htmlFor='onVal'> Value Button On</InputLabel>
                        <Input
                          className={classes.input}
                          id='number'
                          type='number'
                          name={`input-onval-name-${idx}`}
                          value={(onVal && onVal) || 127}
                          onChange={e => this.props.actions.setOnVal({ idx, val: e.target.value })}
                        />
                      </FormControl>
                      <FormControl className={classes.formControl}>
                        <InputLabel className={classes.label} htmlFor='offVal'>Value Button Off</InputLabel>
                        <Input
                          className={classes.input}
                          id='number'
                          type='number'
                          name={`input-offval-name-${idx}`}
                          value={(offVal && offVal) || 0}
                          onChange={e => this.props.actions.setOffVal({ idx, val: e.target.value })}
                        />
                      </FormControl>
                      <FormControl className={classes.formControl}>
                        <InputLabel
                          className={classes.label}
                          htmlFor='button-type'
                        >
                        Type
                        </InputLabel>
                        <Select
                          className={classes.select}
                          onChange={this.handleButtonTypeChange.bind(this, idx)}
                          value={type}
                        >
                          {this.renderButtonTypeSelection()}
                        </Select>
                      </FormControl>
                    </React.Fragment>
                  )}

                <ColorModal
                  title='Background'
                  sliderEntry={sliderEntry}
                  idx={idx}
                  fieldName='color'
                  color={colors.color}
                />
                <ColorModal
                  title='Font-Color'
                  sliderEntry={sliderEntry}
                  idx={idx}
                  fieldName='colorFont'
                  color={colors.colorFont}
                />
                <ColorModal
                  title='Activated State'
                  sliderEntry={sliderEntry}
                  idx={idx}
                  fieldName='colorActive'
                  color={colors.colorActive}
                />
                <ColorModal
                  title='Font-Color Activated'
                  sliderEntry={sliderEntry}
                  idx={idx}
                  fieldName='colorFontActive'
                  color={colors.colorFontActive}
                />
              </FormControl>
            </React.Fragment>
          ) : (
            <div />
          )
        }
        {
          ([SLIDER, SLIDER_HORZ].includes(type))
            ? (
              <React.Fragment>
                <FormControl className={classes.formControl}>
                  <InputLabel className={classes.label} htmlFor='maxVal'>Maximum Value </InputLabel>
                  <Input
                    className={classes.input}
                    id='number'
                    type='number'
                    name={`input-maxval-name-${idx}`}
                    value={(maxVal && maxVal) || 127}
                    onChange={e => this.props.actions.setMaxVal({ idx, val: e.target.value })} />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel className={classes.label} htmlFor='maxVal'>Minimum Value </InputLabel>
                  <Input
                    className={classes.input}
                    id='number'
                    type='number'
                    name={`input-minval-name-${idx}`}
                    value={(minVal && minVal) || 0}
                    onChange={e => this.props.actions.setMinVal({ idx, val: e.target.value })} />
                </FormControl>
                <FormControl>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={sliderEntry.isValueHidden && sliderEntry.isValueHidden}
                        onChange={this.props.actions.toggleHideValue.bind(this, { i: sliderEntry.i })}
                      />
                    }
                    label='Hide Value'
                  />
                </FormControl>
              </React.Fragment>
            )
            : (
              <div />
            )

        }
        <FormControl>
          <Typography
            className={classes.label}
            htmlFor='fontsize'
          >
            {'Font Size:  ' + (fontSize || 16) + 'px'}
          </Typography>
          <input
            type='range'
            min={8}
            max={64}
            value={fontSize || 16}
            onChange={this.handleFontsizeChange.bind(this, i)}
          />
          <Typography
            className={classes.label}
            htmlFor='fontWeight'
          >
            {'Font Weight:  ' + (fontWeight || 500)}
          </Typography>
          <input
            type='range'
            min={100}
            max={900}
            step={100}
            value={fontWeight || 500}
            onChange={this.handleFontweightChange.bind(this, i)}
          />
        </FormControl>

        <Tooltip
          title='Clone'>
          <Button
            className={classes.button}
            variant='contained'
            onClick={this.props.actions.clone.bind(this, sliderEntry)}
          >
            <CopyIcon className={classes.iconColor} />
          </Button>
        </Tooltip>

        <DeleteModal
          asButton
          isOpen={false}
          sliderEntry={sliderEntry}
          idx={idx}
          onAction={this.handleDelete}
          onClose={this.props.onClose}
        />

      </div>
    )
  }

  handleDelete = ({ idx }) => {
    this.props.actions.delete({ idx })
    this.props.actions.deletePageFromFooter({ idx })
  }

  suggestionsMidiCc =
    Array
      .apply(null, { length: 128 })
      .map(Number.call, Number)
      .map((item) => {
        return { label: `${item}` }
      })

  handleLabelChange = (i, idx, e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.actions.changeLabel({
      idx,
      val: e.target.value
    })
    if (this.props.sliderEntry.type === 'PAGE') {
      this.props.actions.changeFooterPageLabel({
        i,
        val: e.target.value
      })
    }
  }

  handleAddCCListener = (e) => {
    // detecrt if empty state
    let isEmpty = this.props.sliderList.every((item) => item.listenToCc.length === 0)
    this.props.actions.addMidiCcListener(e)

    // this is a hack
    // TODO: get rid of it
    isEmpty && window.location.reload()
  }
  handleButtonTypeChange = (idx, e) => {
    this.props.actions.changeButtonType({
      idx,
      val: e.target.value
    })
  }

  renderDriverSelection = (availableDrivers, type) => {
    let tmpArray =
      ![LABEL, PAGE].includes(type)
        ? availableDrivers : [{ outputId: 'None', name: 'None' }, ...availableDrivers]

    return tmpArray.map((item, idx) => {
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
        [BUTTON_CC, BUTTON_TOGGLE_CC].map((item, btnIdx) => {
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
        [BUTTON, BUTTON_TOGGLE].map((item, btnIdx) => {
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

  handleFontsizeChange = (i, e) => {
    this.props.actions.changeFontSize({
      i,
      fontSize: e.target.value
    })
  }

  handleFontweightChange = (i, e) => {
    this.props.actions.changeFontWeight({
      i,
      fontWeight: e.target.value
    })
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
    actions: bindActionCreators({...MidiSliderActions, ...ViewActions}, dispatch)
  }
}
function mapStateToProps ({ sliderList }) {
  return {
    sliderList
  }
}
export default (withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MidiSettings)))
