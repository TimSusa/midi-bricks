import { MidiSettingsView } from './elements/MidiSettingsView'
import { MidiSettingsLabel } from './elements/MidiSettingsLabel'
import React from 'react'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import Tooltip from '@material-ui/core/Tooltip'
import CopyIcon from '@material-ui/icons/NoteAdd'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { initApp } from '../../../../../actions/init.js'
import * as MidiSliderActions from '../../../../../actions/slider-list.js'
import * as ViewActions from '../../../../../actions/view-settings.js'
import DeleteModal from '../../../../DeleteModal'
import DriverExpansionPanel from '../../../../DriverExpansionPanel'
import { MidiSettingsInput } from './elements/MidiSettingsInput'
import { MidiSettingsOutput } from './elements/MidiSettingsOutput'
import { DriverEmtpyRedirectButton } from './elements/DriverEmtpyRedirectButton'

import { STRIP_TYPE } from '../../../../../reducers/slider-list'

const { BUTTON, BUTTON_CC, BUTTON_TOGGLE, BUTTON_TOGGLE_CC } = STRIP_TYPE

class MidiSettings extends React.PureComponent {
  render() {
    const {
      inputs = {},
      outputs = {},
      sliderEntry,
      sliderEntry: { i, label, type },
      idx,
      classes,
    } = this.props

    return (
      <div className={classes.root}>
        <MidiSettingsLabel
          classes={classes}
          idx={idx}
          label={label}
          i={i}
          handleLabelChange={this.handleLabelChange}
        />

        {type !== STRIP_TYPE.PAGE ? (
          <DriverExpansionPanel
            label={'Outputs'}
            isEmpty={this.isAllEmpty(outputs)}
          >
            {this.isAllEmpty(outputs) ? (
              <DriverEmtpyRedirectButton actions={this.props.actions} />
            ) : (
              <MidiSettingsOutput
                classes={classes}
                sliderEntry={sliderEntry}
                idx={idx}
                outputs={outputs}
                actions={this.props.actions}
                renderDriverSelection={this.renderDriverSelection}
                renderMidiChannelSelection={this.renderMidiChannelSelection}
              />
            )}
          </DriverExpansionPanel>
        ) : null}
        <DriverExpansionPanel
          label={'Inputs'}
          isEmpty={this.isAllEmpty(inputs)}
        >
          {this.isAllEmpty(inputs) ? (
            <DriverEmtpyRedirectButton actions={this.props.actions} />
          ) : (
            <MidiSettingsInput
              classes={classes}
              sliderEntry={sliderEntry}
              idx={idx}
              inputs={inputs}
              actions={this.props.actions}
              suggestionsMidiCc={this.suggestionsMidiCc}
              handleAddCcCListener={this.handleAddCCListener}
              renderDriverSelection={this.renderDriverSelection}
              renderMidiChannelSelection={this.renderMidiChannelSelection}
            />
          )}
        </DriverExpansionPanel>
        <DriverExpansionPanel label="View" isEmpty={false}>
          <MidiSettingsView
            sliderEntry={sliderEntry}
            classes={classes}
            actions={this.props.actions}
            handleButtonTypeChange={this.handleButtonTypeChange}
            renderButtonTypeSelection={this.renderButtonTypeSelection}
            handleFontsizeChange={this.handleFontsizeChange}
            handleFontweightChange={this.handleFontweightChange}
          />
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

const hasContent = arr => Array.isArray(arr) && arr.length > 0
