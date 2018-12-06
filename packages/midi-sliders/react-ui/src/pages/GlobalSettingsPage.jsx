import {
  withStyles,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Tooltip,
  Paper
} from '@material-ui/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../actions/slider-list.js'
import * as ViewStuff from '../actions/view-settings.js'
import MidiSettingsDialog from '../components/channel-strip-list/channel-strip/midi-settings-dialog/MidiSettingsDialog'
import { outputToDriverName } from '../utils/output-to-driver-name.js'
import { initApp } from '../actions/init.js'

class GlobalSettingsPage extends React.PureComponent {
  constructor (props) {
    super(props)
    this.props.actions.toggleLiveMode({ isLiveMode: false })
  }
  render () {
    const {
      classes,
      actions,
      sliderList,
      sliderListBackup,
      midi: {
        midiAccess: {
          inputs,
          outputs
        }
      },
      viewSettings: {
        isSettingsDialogMode,
        lastFocusedIdx,
        availableDrivers: {
          outputs: chosenOutputs
        }
      }
    } = this.props

    return (
      <Paper
        style={{ flexDirection: 'column' }}
        className={classes.root}
      >

        <Table
          className={classes.table}
        >
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
            {
              sliderList && sliderList.map((sliderEntry, idx) => {
                const {
                  label,
                  type,
                  midiChannel,
                  midiCC,
                  val,
                  lastSavedVal,
                  midiChannelInput,
                  listenToCc
                } = sliderEntry

                let rowStyle = {
                  background: 'none',
                  cursor: 'pointer'
                }

                if (this.hasChanged(sliderListBackup, sliderEntry)) {
                  rowStyle.background = 'aliceblue'
                }

                if (isSettingsDialogMode && (idx === lastFocusedIdx)) {
                  return (
                    <MidiSettingsDialog
                      key={`glb-settings-${idx}`}
                      open
                      onClose={actions.toggleSettingsDialogMode.bind(this, { idx, isSettingsDialogMode: false })}
                      sliderEntry={sliderEntry}
                      idx={idx}
                    />
                  )
                }
                let title = ''
                const { driverName, driverNameInput } = outputToDriverName({ inputs, outputs }, sliderEntry.driverNameInput || 'None', sliderEntry.driverName || 'None')

                if (!['PAGE', 'LABEL'].includes(sliderEntry.type)) {
                  if (driverNameInput && (driverNameInput !== 'None') && driverName) {
                    title = `Output: ${driverName} / Input: ${driverNameInput}`
                  } else if (driverName) {
                    title = `Output: ${driverName}`
                    if (!driverNameInput) {
                      title = title + ' / Input: No MIDI Input Driver available'
                      rowStyle.background = 'yellow'
                    }
                  } else if (!driverName) {
                    title = 'No MIDI Output Driver available'
                    rowStyle.background = 'red'
                  }
                }

                let foundMischosenDriver = false
                Object.keys(chosenOutputs)
                  .forEach((name) => {
                    if (foundMischosenDriver) return
                    if (name === driverName) {
                      if (!foundMischosenDriver && (chosenOutputs[name] && chosenOutputs[name].ccChannels && chosenOutputs[name].ccChannels.length <= 0) && (chosenOutputs[name] && chosenOutputs[name].noteChannels && chosenOutputs[name].noteChannels.length <= 0)) {
                        foundMischosenDriver = true
                        rowStyle.background = 'pink'
                        title = `Output Driver "${driverName}" is disabled in MIDI Driver Settings`
                      }
                    }
                  })

                return (
                  <Tooltip
                    title={title}
                    key={`glb-${idx}`}
                  >
                    <TableRow
                      style={rowStyle}
                      onClick={actions.toggleSettingsDialogMode.bind(this, { idx, isSettingsDialogMode: true })}
                    >
                      <TableCell>
                        {label || '-'}
                      </TableCell>
                      <TableCell>
                        {type}
                      </TableCell>
                      <TableCell style={{ color: !driverName && 'grey' }}>
                        {driverName || 'None'}
                      </TableCell>
                      <TableCell>
                        {midiChannel}
                      </TableCell>
                      <TableCell>
                        {(midiCC && (midiCC.length > 0) && this.renderListeners(midiCC)) || '-'}
                      </TableCell>
                      <TableCell>
                        {!['PAGE', 'LABEL'].includes(type) ? sliderEntry && val : '-'}
                      </TableCell>
                      <TableCell>
                        {!['PAGE', 'LABEL'].includes(type) ? lastSavedVal && (lastSavedVal || '_') : '-'}
                      </TableCell>
                      <TableCell style={{ color: !driverNameInput && 'grey' }}>
                        {driverNameInput || driverNameInput || 'None'}
                      </TableCell>
                      <TableCell>
                        {(listenToCc && (listenToCc.length > 0) && this.renderListeners(listenToCc)) || '-'}
                      </TableCell>
                      <TableCell>
                        {midiChannelInput}
                      </TableCell>
                    </TableRow>
                  </Tooltip>

                )
              })
            }
          </TableBody>
        </Table>

      </Paper>
    )
  }

  renderListeners = (tmp) => {
    return (<div>{tmp.join(', ')}</div>)
  }

  hasChanged = (sliderListBackup, sliderEntry) => {
    let retVal = false
    sliderListBackup && sliderListBackup.forEach((sliderBackupEntry, idx) => {
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
  root: {
  },
  table: {
    textAlign: 'left'
  },
  heading: {
    marginTop: theme.spacing.unit * 2
  }
})

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ ...MidiSliderActions, ...ViewStuff }, dispatch),
    initApp: bindActionCreators(initApp, dispatch)
  }
}
function mapStateToProps ({ sliders: { sliderList, midi, sliderListBackup }, viewSettings }) {
  return {
    sliderList,
    midi,
    viewSettings,
    sliderListBackup
  }
}
export default (withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(GlobalSettingsPage)))
