import {
  withStyles,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Tooltip,
  Paper,
} from '@material-ui/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../actions/slider-list.js'
import * as ViewStuff from '../actions/view-settings.js'
import MidiSettingsDialog from '../components/channel-strip-list/channel-strip/midi-settings-dialog/MidiSettingsDialog'
import { outputToDriverName } from '../utils/output-to-driver-name.js'
import { initApp } from '../actions/init.js'
import { STRIP_TYPE } from '../reducers/slider-list.js'

class GlobalSettingsPage extends React.PureComponent {
  constructor(props) {
    super(props)
    this.props.actions.toggleLiveMode({ isLiveMode: false })
  }
  render() {
    const {
      classes,
      actions,
      sliderList,
      sliderListBackup,
      midi: {
        midiAccess: { inputs, outputs },
      },
      viewSettings: {
        isSettingsDialogMode,
        lastFocusedIdx,
        availableDrivers: { outputs: chosenOutputs, inputs: chosenInputs },
      },
    } = this.props

    return (
      <Paper style={{ flexDirection: 'column' }} className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Label</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Output Driver</TableCell>
              <TableCell>Output Channel</TableCell>
              <TableCell>Note(s)/CC</TableCell>
              <TableCell>Current Value</TableCell>
              <TableCell>Saved Value</TableCell>
              <TableCell>Input Driver</TableCell>
              <TableCell>Listeners</TableCell>
              <TableCell>Input Channel</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sliderList &&
              sliderList.map((sliderEntry, idx) => {
                const {
                  label,
                  type,
                  midiChannel,
                  midiCC,
                  val,
                  lastSavedVal,
                  midiChannelInput,
                  listenToCc,
                } = sliderEntry

                let rowStyle = {
                  background: 'none',
                  cursor: 'pointer',
                }

                if (this.hasChanged(sliderListBackup, sliderEntry)) {
                  rowStyle.background = 'aliceblue'
                }

                if (isSettingsDialogMode && idx === lastFocusedIdx) {
                  return (
                    <MidiSettingsDialog
                      key={`glb-settings-${idx}`}
                      open
                      onClose={actions.toggleSettingsDialogMode.bind(this, {
                        idx,
                        isSettingsDialogMode: false,
                      })}
                      sliderEntry={sliderEntry}
                      idx={idx}
                    />
                  )
                }
                let title = ''
                let channelTooltipTitle = ''
                const { driverName, driverNameInput } = outputToDriverName(
                  { inputs, outputs },
                  sliderEntry.driverNameInput || 'None',
                  sliderEntry.driverName || 'None'
                )
                const {
                  title: tooltipTitle,
                  background,
                } = createTooltipAndBackground(
                  sliderEntry.type,
                  driverNameInput,
                  driverName
                )
                if (background) {
                  rowStyle.background = background
                }
                if (tooltipTitle) {
                  title = tooltipTitle
                }
                let isBadChosenOutputDriver = false
                let isBadChosenInputDriver = false
                let isBadChosenOutputChannel = false
                let isBadChosenInputChannel = false
                if (isBadChosenDriver(chosenOutputs, driverName)) {
                  isBadChosenOutputDriver = true
                  title = `Output Driver "${driverName}" is disabled in MIDI Driver Settings. `
                } else {
                  isBadChosenOutputChannel = isBadChosenChannel(
                    chosenOutputs,
                    midiChannel,
                    driverName,
                    type,
                    true
                  )
                  if (isBadChosenOutputChannel) {
                    if (midiChannel) {
                      channelTooltipTitle = `Output Channel "${midiChannel}" for driver "${driverName}" is disabled in MIDI Driver Settings`
                    } else {
                      channelTooltipTitle = `No Output Channel for driver "${driverName}" was chosen`
                    }
                  }
                }
                if (isBadChosenDriver(chosenInputs, driverNameInput)) {
                  isBadChosenInputDriver = true
                  title = `Input Driver "${driverNameInput}" is disabled in MIDI Driver Settings. `
                } else {
                  isBadChosenInputChannel = isBadChosenChannel(
                    chosenInputs,
                    midiChannelInput,
                    driverNameInput,
                    type,
                    false
                  )
                  if (isBadChosenInputChannel) {
                    if (midiChannelInput) {
                      channelTooltipTitle = `Input Channel "${midiChannelInput}" for driver "${driverNameInput}" is disabled in MIDI Driver Settings`
                    } else {
                      channelTooltipTitle = `No Input Channel for driver "${driverNameInput}" was chosen`
                    }
                  }
                }
                return (
                  <Tooltip
                    title={title + channelTooltipTitle}
                    key={`glb-${idx}`}
                  >
                    <TableRow
                      style={rowStyle}
                      onClick={actions.toggleSettingsDialogMode.bind(this, {
                        idx,
                        isSettingsDialogMode: true,
                      })}
                    >
                      <TableCell>{label || '-'}</TableCell>
                      <TableCell>{type}</TableCell>
                      <TableCell
                        style={{
                          color: !driverName && 'grey',
                          background: isBadChosenOutputDriver && 'pink',
                        }}
                      >
                        {driverName || 'None'}
                      </TableCell>
                      <TableCell
                        style={{
                          background: isBadChosenOutputChannel && 'pink',
                        }}
                      >
                        {midiChannel}
                      </TableCell>
                      <TableCell>
                        {(midiCC &&
                          midiCC.length > 0 &&
                          this.renderListeners(midiCC)) ||
                          '-'}
                      </TableCell>
                      <TableCell>
                        {![STRIP_TYPE.PAGE, STRIP_TYPE.LABEL].includes(type)
                          ? sliderEntry && val
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {![STRIP_TYPE.PAGE, STRIP_TYPE.LABEL].includes(type)
                          ? lastSavedVal && (lastSavedVal || '_')
                          : '-'}
                      </TableCell>
                      <TableCell
                        style={{
                          color: !driverNameInput && 'grey',
                          background: isBadChosenInputDriver && 'pink',
                        }}
                      >
                        {driverNameInput || driverNameInput || 'None'}
                      </TableCell>
                      <TableCell>
                        {(listenToCc &&
                          listenToCc.length > 0 &&
                          this.renderListeners(listenToCc)) ||
                          '-'}
                      </TableCell>
                      <TableCell
                        style={{
                          background: isBadChosenInputChannel && 'pink',
                        }}
                      >
                        {midiChannelInput}
                      </TableCell>
                    </TableRow>
                  </Tooltip>
                )
              })}
          </TableBody>
        </Table>
      </Paper>
    )
  }

  renderListeners = tmp => {
    return <div>{tmp.join(', ')}</div>
  }

  hasChanged = (sliderListBackup, sliderEntry) => {
    let retVal = false
    sliderListBackup &&
      sliderListBackup.forEach((sliderBackupEntry, idx) => {
        if (sliderBackupEntry.i === sliderEntry.i) {
          const backupVals = Object.values(sliderBackupEntry)
          const vals = Object.values(sliderEntry)
          retVal = backupVals.join(', ') !== vals.join(', ')
        }
      })
    return retVal
  }
}

const styles = theme => ({
  root: {},
  table: {
    textAlign: 'left',
  },
  heading: {
    marginTop: theme.spacing.unit * 2,
  },
})

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...MidiSliderActions, ...ViewStuff },
      dispatch
    ),
    initApp: bindActionCreators(initApp, dispatch),
  }
}
function mapStateToProps({
  sliders: { sliderList, midi, sliderListBackup },
  viewSettings,
}) {
  return {
    sliderList,
    midi,
    viewSettings,
    sliderListBackup,
  }
}
export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(GlobalSettingsPage)
)

function isBadChosenDriver(driverObject, driverName) {
  if (driverName === 'None') return false
  let foundMischosenDriver = false
  Object.keys(driverObject).forEach(name => {
    if (foundMischosenDriver || name === 'None') return false
    if (name === driverName) {
      if (
        (!foundMischosenDriver &&
          (driverObject[name] &&
            driverObject[name].ccChannels &&
            driverObject[name].ccChannels.length <= 0)) ||
        (driverObject[name] &&
          driverObject[name].noteChannels &&
          driverObject[name].noteChannels.length <= 0)
      ) {
        foundMischosenDriver = true
      }
    }
  })
  return foundMischosenDriver
}

function isBadChosenChannel(driverObject, channel, driverName, type, isOut) {
  if (driverName === 'None') return false
  if (!channel) return true

  let foundMischosenChannel = false
  const isNoteChannels =
    driverObject[driverName] &&
    driverObject[driverName].noteChannels &&
    driverObject[driverName].noteChannels.includes(`${channel}`)
  const isCcChannels =
    driverObject[driverName] &&
    driverObject[driverName].ccChannels &&
    driverObject[driverName].ccChannels.includes(`${channel}`)

  // For page and label, only cc inputs can happen
  if ([STRIP_TYPE.PAGE, STRIP_TYPE.LABEL].includes(type) && !isOut) {
    foundMischosenChannel = !isCcChannels
  }

  // slider // cc button
  if (
    [
      STRIP_TYPE.SLIDER,
      STRIP_TYPE.SLIDER_HORZ,
      STRIP_TYPE.BUTTON_CC,
      STRIP_TYPE.BUTTON_TOGGLE_CC,
    ].includes(type)
  ) {
    foundMischosenChannel = !isCcChannels
  }

  // button
  if ([STRIP_TYPE.BUTTON, STRIP_TYPE.BUTTON_TOGGLE].includes(type)) {
    foundMischosenChannel = !isNoteChannels
  }

  return foundMischosenChannel
}

function createTooltipAndBackground(type, driverNameInput, driverName) {
  let title = undefined
  let background = undefined
  if (![STRIP_TYPE.PAGE, STRIP_TYPE.LABEL].includes(type)) {
    if (driverNameInput && driverName) {
      //title = `Output: ${driverName} / Input: ${driverNameInput}`
    } else if (driverName) {
      //title = `Output: ${driverName}`
      if (!driverNameInput) {
        title = title + ' / Input: No MIDI Input Driver available'
        background = 'yellow'
      }
    } else if (!driverName) {
      title = 'No MIDI Output Driver available'
      background = 'red'
    }
  }
  return { title, background }
}
