import {
  withStyles,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Tooltip
} from '@material-ui/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../actions/slider-list.js'
import * as ViewStuff from '../actions/view-settings.js'
import MidiSettingsDialog from '../components/channel-strip-list/channel-strip/midi-settings-dialog/MidiSettingsDialog'
import { outputIdToDriverName } from '../utils/output-to-driver-name.js'
import { initApp } from '../actions/init.js'

class GlobalSettingsPage extends React.PureComponent {
  constructor (props) {
    super(props)
    this.props.actions.toggleLiveMode({ isLiveMode: false })

    // track driver changes after browser reload
    // this.props.initApp()
  }
  render () {
    const {
      classes,
      sliderList,
      sliderListBackup,
      midi,
      viewSettings: {
        isSettingsDialogMode,
        lastFocusedIdx
      }
    } = this.props

    return (
      <Table
        className={classes.root}
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
              const { driverName, outputId, driverNameInput = 'None' } = sliderEntry// outputIdToDriverName(midi.midiDrivers, sliderEntry.outputId, sliderEntry.driverName)

              let rowStyle = {
                background: 'none',
                cursor: 'pointer'
              }

              if (this.hasChanged(sliderListBackup, sliderEntry)) {
                rowStyle.background = 'aliceblue'
              }

              if (((!outputId || !driverName) && !['PAGE', 'LABEL'].includes(sliderEntry.type))) {
                rowStyle.background = 'red'
              }

              if (isSettingsDialogMode && (idx === lastFocusedIdx)) {
                return (
                  <MidiSettingsDialog
                    key={`glb-settings-${idx}`}
                    open
                    onClose={this.props.actions.toggleSettingsDialogMode.bind(this, { idx, isSettingsDialogMode: false })}
                    sliderEntry={sliderEntry}
                    idx={idx}
                  />
                )
              }
              let title = ''
              if (!['PAGE', 'LABEL'].includes(sliderEntry.type)) {
                if (outputId && driverName) {
                  title = driverName
                } else if (!driverName) {
                  title = 'No MIDI Driver available'
                } else if (!outputId) {
                  title = 'Driver ID cannot be found. Please reload the preset again, for self-healing or reselect the driver.'
                }
              }

              return (
                <Tooltip
                  title={title}
                  key={`glb-${idx}`}
                >
                  <TableRow
                    style={rowStyle}
                    onClick={this.props.actions.toggleSettingsDialogMode.bind(this, { idx, isSettingsDialogMode: true })}
                  >
                    <TableCell>
                      {sliderEntry.label || '-'}
                    </TableCell>
                    <TableCell>
                      {sliderEntry.type}
                    </TableCell>
                    <TableCell style={{ color: !driverName && 'grey' }}>
                      {driverName || sliderEntry.driverName || 'None'}
                    </TableCell>
                    <TableCell>
                      {sliderEntry.midiChannel}
                    </TableCell>
                    <TableCell>
                      {(sliderEntry.midiCC && (sliderEntry.midiCC.length > 0) && this.renderListeners(sliderEntry.midiCC)) || '-'}
                    </TableCell>
                    <TableCell>
                      {!['PAGE', 'LABEL'].includes(sliderEntry.type) ? sliderEntry && sliderEntry.val : '-'}
                    </TableCell>
                    <TableCell>
                      {!['PAGE', 'LABEL'].includes(sliderEntry.type) ? sliderEntry.lastSavedVal && (sliderEntry.lastSavedVal || '_') : '-'}
                    </TableCell>
                    <TableCell style={{ color: !driverNameInput && 'grey' }}>
                      {driverNameInput || sliderEntry.driverNameInput || 'None'}
                    </TableCell>
                    <TableCell>
                      {(sliderEntry.listenToCc && (sliderEntry.listenToCc.length > 0) && this.renderListeners(sliderEntry.listenToCc)) || '-'}
                    </TableCell>
                    <TableCell>
                      {sliderEntry.midiChannelInput}
                    </TableCell>
                  </TableRow>
                </Tooltip>

              )
            })
          }
        </TableBody>
      </Table>
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
    textAlign: 'left',
    width: '100%'
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
