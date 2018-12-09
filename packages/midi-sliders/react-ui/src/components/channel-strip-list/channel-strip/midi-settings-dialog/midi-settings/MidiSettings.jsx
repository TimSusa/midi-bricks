import React from 'react'
import {
  Typography,
} from '@material-ui/core'
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
import { initApp } from '../../../../../actions/init.js'
import * as MidiSliderActions from '../../../../../actions/slider-list.js'
import * as ViewActions from '../../../../../actions/view-settings.js'
import InputNoteOrCc from './elements/InputNoteOrCc'
import DeleteModal from '../../../../DeleteModal'
import ColorModal from './elements/ColorModal'
import MidiSuggestedInput from './elements/MidiSuggestedInput'
import DriverExpansionPanel from '../../../../DriverExpansionPanel'

import { STRIP_TYPE } from '../../../../../reducers/slider-list.js'
import { PAGE_TYPES } from '../../../../../reducers/view-settings.js'

const {
  BUTTON,
  BUTTON_CC,
  BUTTON_TOGGLE,
  BUTTON_TOGGLE_CC,
  SLIDER,
  SLIDER_HORZ,
} = STRIP_TYPE

class MidiSettings extends React.PureComponent {
  render() {
    const {
      inputs = {},
      outputs = {},
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
        driverNameInput = 'None',
        driverName = 'None',
        midiChannel,
        midiChannelInput,
        listenToCc,
        fontSize,
        fontWeight,
      },
      idx,
      classes,
    } = this.props

    return (
      <div className={classes.root}>
        <FormControl className={classes.formControl}>
          <InputLabel className={classes.label} htmlFor="label">
            Label
          </InputLabel>
          <Input
            className={classes.input}
            id="label"
            type="label"
            name={`input-label-name-${idx}`}
            value={label}
            onChange={this.handleLabelChange.bind(this, i, idx)}
            autoFocus
          />
        </FormControl>

        <DriverExpansionPanel
          label={'Outputs'}
          isEmpty={this.isAllEmpty(outputs)}
        >
          {this.isAllEmpty(outputs) ? (
            <div>
              <Tooltip title="No MIDI Driver available. Go to settings...">
                <Button
                  onClick={() =>
                    this.props.actions.togglePage({
                      pageType: PAGE_TYPES.MIDI_DRIVER_MODE,
                    })
                  }
                >
                  Go to Driver Settings
                </Button>
              </Tooltip>
            </div>
          ) : (
            <React.Fragment>
              <InputNoteOrCc sliderEntry={sliderEntry} idx={idx} />
              <FormControl className={classes.formControl}>
                <InputLabel className={classes.label} htmlFor="midi-driver">
                  Driver
                </InputLabel>
                <Select
                  className={classes.select}
                  onChange={e =>
                    this.props.actions.selectMidiDriver({
                      i,
                      driverName: e.target.value,
                    })
                  }
                  value={driverName || 'None'}
                >
                  {this.renderDriverSelection({ outputs })}
                </Select>
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel className={classes.label} htmlFor="output-cc-input">
                  Channel
                </InputLabel>
                <Select
                  className={classes.select}
                  onChange={e =>
                    this.props.actions.selectMidiChannel({
                      idx,
                      val: e.target.value,
                    })
                  }
                  value={midiChannel || 'None'}
                >
                  {this.renderMidiChannelSelection(
                    { outputs },
                    driverName,
                    type
                  )}
                </Select>
              </FormControl>
              {[SLIDER, SLIDER_HORZ].includes(type) && (
                <React.Fragment>
                  <FormControl className={classes.formControl}>
                    <InputLabel className={classes.label} htmlFor="maxVal">
                      Maximum Value{' '}
                    </InputLabel>
                    <Input
                      className={classes.input}
                      id="number"
                      type="number"
                      name={`input-maxval-name-${idx}`}
                      value={(maxVal && maxVal) || 127}
                      onChange={e =>
                        this.props.actions.setMaxVal({
                          idx,
                          val: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl className={classes.formControl}>
                    <InputLabel className={classes.label} htmlFor="minVal">
                      Minimum Value{' '}
                    </InputLabel>
                    <Input
                      className={classes.input}
                      id="number"
                      type="number"
                      name={`input-minval-name-${idx}`}
                      value={(minVal && minVal) || 0}
                      onChange={e =>
                        this.props.actions.setMinVal({
                          idx,
                          val: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                </React.Fragment>
              )}
              {
                <React.Fragment>
                  {[
                    BUTTON,
                    BUTTON_CC,
                    BUTTON_TOGGLE,
                    BUTTON_TOGGLE_CC,
                  ].includes(type) && (
                    <React.Fragment>
                      <FormControl className={classes.formControl}>
                        <InputLabel className={classes.label} htmlFor="onVal">
                          {' '}
                          Value Button On
                        </InputLabel>
                        <Input
                          className={classes.input}
                          id="number"
                          type="number"
                          name={`input-onval-name-${idx}`}
                          value={(onVal && onVal) || 127}
                          onChange={e =>
                            this.props.actions.setOnVal({
                              idx,
                              val: e.target.value,
                            })
                          }
                        />
                      </FormControl>
                      <FormControl className={classes.formControl}>
                        <InputLabel className={classes.label} htmlFor="offVal">
                          Value Button Off
                        </InputLabel>
                        <Input
                          className={classes.input}
                          id="number"
                          type="number"
                          name={`input-offval-name-${idx}`}
                          value={(offVal && offVal) || 0}
                          onChange={e =>
                            this.props.actions.setOffVal({
                              idx,
                              val: e.target.value,
                            })
                          }
                        />
                      </FormControl>
                    </React.Fragment>
                  )}
                </React.Fragment>
              }
            </React.Fragment>
          )}
        </DriverExpansionPanel>
        <DriverExpansionPanel
          label={'Inputs'}
          isEmpty={this.isAllEmpty(inputs)}
        >
          {this.isAllEmpty(inputs) ? (
            <div>
              <Tooltip title="No MIDI Driver available. Go to settings...">
                <Button
                  onClick={() =>
                    this.props.actions.togglePage({
                      pageType: PAGE_TYPES.MIDI_DRIVER_MODE,
                    })
                  }
                >
                  Go to Driver Settings
                </Button>
              </Tooltip>
            </div>
          ) : (
            <React.Fragment>
              <FormControl>
                <InputLabel className={classes.label} htmlFor="cc">
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
                <InputLabel className={classes.label} htmlFor="midi-driver">
                  Driver
                </InputLabel>
                <Select
                  className={classes.select}
                  onChange={e =>
                    this.props.actions.selectMidiDriverInput({
                      i,
                      driverNameInput: e.target.value,
                    })
                  }
                  value={driverNameInput}
                >
                  {this.renderDriverSelection({ inputs })}
                </Select>
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel className={classes.label} htmlFor="input-ch-input">
                  Input Channel{' '}
                </InputLabel>
                <Select
                  className={classes.select}
                  onChange={e =>
                    this.props.actions.selectMidiChannelInput({
                      idx,
                      val: e.target.value,
                    })
                  }
                  value={midiChannelInput || 'None'}
                >
                  {this.renderMidiChannelSelection(
                    { inputs },
                    driverNameInput,
                    type
                  )}
                </Select>
              </FormControl>
            </React.Fragment>
          )}
        </DriverExpansionPanel>
        <DriverExpansionPanel label="View" isEmpty={false}>
          {![SLIDER, SLIDER_HORZ].includes(type) && (
            <FormControl>
              {[BUTTON, BUTTON_CC, BUTTON_TOGGLE, BUTTON_TOGGLE_CC].includes(
                type
              ) && (
                <React.Fragment>
                  <InputLabel className={classes.label} htmlFor="button-type">
                    Type
                  </InputLabel>
                  <Select
                    className={classes.select}
                    onChange={this.handleButtonTypeChange.bind(this, idx)}
                    value={type}
                  >
                    {this.renderButtonTypeSelection()}
                  </Select>
                </React.Fragment>
              )}

              <ColorModal
                title="Background"
                sliderEntry={sliderEntry}
                idx={idx}
                fieldName="color"
                color={colors.color}
              />
              <ColorModal
                title="Activated State"
                sliderEntry={sliderEntry}
                idx={idx}
                fieldName="colorActive"
                color={colors.colorActive}
              />
              <ColorModal
                title="Font-Color"
                sliderEntry={sliderEntry}
                idx={idx}
                fieldName="colorFont"
                color={colors.colorFont}
              />

              <ColorModal
                title="Activated Font-Color"
                sliderEntry={sliderEntry}
                idx={idx}
                fieldName="colorFontActive"
                color={colors.colorFontActive}
              />
            </FormControl>
          )}

          <FormControl>
            <Typography className={classes.label} htmlFor="fontsize">
              {'Font Size:  ' + (fontSize || 16) + 'px'}
            </Typography>
            <input
              type="range"
              min={8}
              max={54}
              value={fontSize || 16}
              onChange={this.handleFontsizeChange.bind(this, i)}
            />
            <Typography className={classes.label} htmlFor="fontWeight">
              {'Font Weight:  ' + (fontWeight || 500)}
            </Typography>
            <input
              type="range"
              min={100}
              max={900}
              step={100}
              value={fontWeight || 500}
              onChange={this.handleFontweightChange.bind(this, i)}
            />
          </FormControl>
          {[SLIDER, SLIDER_HORZ].includes(type) && (
            <FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    className={classes.iconColor}
                    checked={
                      sliderEntry.isValueHidden && sliderEntry.isValueHidden
                    }
                    onChange={this.props.actions.toggleHideValue.bind(this, {
                      i: sliderEntry.i,
                    })}
                  />
                }
                label="Hide Value"
              />
            </FormControl>
          )}
        </DriverExpansionPanel>
        <Tooltip title="Clone">
          <Button
            className={classes.button}
            variant="contained"
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
    this.props.actions.delete({ i: idx })
    this.props.actions.deletePageFromFooter({ idx })
  }

  suggestionsMidiCc = Array.apply(null, { length: 128 })
    .map(Number.call, Number)
    .map(item => {
      return { label: `${item}` }
    })

  handleLabelChange = (i, idx, e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.actions.changeLabel({
      idx,
      val: e.target.value,
    })
    if (this.props.sliderEntry.type === 'PAGE') {
      this.props.actions.changeFooterPageLabel({
        i,
        val: e.target.value,
      })
    }
  }

  handleAddCCListener = e => {
    this.props.actions.addMidiCcListener(e)
    this.props.initApp()
  }

  handleButtonTypeChange = (idx, e) => {
    this.props.actions.changeButtonType({
      idx,
      val: e.target.value,
    })
  }

  renderMidiChannelSelection = ({ inputs, outputs }, name, type) => {
    const puts = inputs || outputs
    const { ccChannels, noteChannels } = puts[name] || 'None'
    let channels = ccChannels || []
    if ([BUTTON, BUTTON_TOGGLE].includes(type)) {
      channels = noteChannels
    }

    if (!channels) {
      return getItem('None', 0)
    }

    // const array = ['all', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16']
    return channels.map((name, idx) => getItem(name, idx))
  }

  renderDriverSelection = ({ inputs, outputs }) => {
    if (inputs) {
      return this.renderSelection(inputs, true)
    }
    if (outputs) {
      return this.renderSelection(outputs, true)
    }
  }

  renderSelection = (obj, withNone) => {
    let ret = []

    Object.keys(obj).forEach((name, idx) => {
      const { ccChannels, noteChannels } = obj[name]
      const hasContent = arr => Array.isArray(arr) && arr.length > 0
      if (hasContent(ccChannels) || hasContent(noteChannels)) {
        ret.push(
          <MenuItem key={`driver-${idx}`} value={name}>
            {name}
          </MenuItem>
        )
      }
    })

    if (withNone) {
      ret.push(getItem('None'))
    }
    return ret
  }

  isAllEmpty = obj => {
    let ret = true

    Object.keys(obj).forEach((name, idx) => {
      const { ccChannels, noteChannels } = obj[name]
      const hasContent = arr => Array.isArray(arr) && arr.length > 0
      if (hasContent(ccChannels) || hasContent(noteChannels)) {
        ret = false
      }
    })

    return ret
  }

  renderButtonTypeSelection = () => {
    const { type } = this.props.sliderEntry
    const isCC = type.endsWith('_CC')
    if (isCC) {
      return [BUTTON_CC, BUTTON_TOGGLE_CC].map((item, btnIdx) => {
        return (
          <MenuItem key={`button-type-cc-${btnIdx}`} value={item}>
            {item}
          </MenuItem>
        )
      })
    } else {
      return [BUTTON, BUTTON_TOGGLE].map((item, btnIdx) => {
        return (
          <MenuItem key={`button-type-${btnIdx}`} value={item}>
            {item}
          </MenuItem>
        )
      })
    }
  }

  handleFontsizeChange = (i, e) => {
    this.props.actions.changeFontSize({
      i,
      fontSize: e.target.value,
    })
  }

  handleFontweightChange = (i, e) => {
    this.props.actions.changeFontWeight({
      i,
      fontWeight: e.target.value,
    })
  }
}

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  expPanel: {
    margin: theme.spacing.unit,
    minHeight: theme.spacing.unit * 8,
  },
  button: {
    margin: theme.spacing.unit,
    background: theme.palette.button.background,
  },
  heading: {
    margin: theme.spacing.unit,
    color: theme.palette.primary.contrastText,
  },
  iconColor: {
    color: theme.palette.primary.contrastText,
    cursor: 'pointer',
  },
  input: {
    color: theme.palette.primary.contrastText, // 'rgba(0, 0, 0, 0.54)',
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em',
  },
  inputInput: {
    margin: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit,
  },
  label: {
    color: theme.palette.primary.contrastText,
  },
  select: {
    color: theme.palette.primary.contrastText,
    lineHeight: '1.375em',
  },
})

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...MidiSliderActions, ...ViewActions },
      dispatch
    ),
    initApp: bindActionCreators(initApp, dispatch),
  }
}
function mapStateToProps({
  viewSettings: { availableDrivers: { inputs = {}, outputs = {} } = {} },
  sliders: { sliderList },
}) {
  return {
    sliderList,
    inputs,
    outputs,
  }
}
export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MidiSettings)
)

const getItem = (name, idx) => (
  <MenuItem key={`input-channel-${idx}`} value={name}>
    {name}
  </MenuItem>
)
