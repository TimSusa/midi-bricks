import {
  withStyles,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead
} from '@material-ui/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../actions/slider-list.js'
import * as ViewStuff from '../actions/view-settings.js'
import MidiSettingsDialog from '../components/channel-strip-list/channel-strip/midi-settings-dialog/MidiSettingsDialog'

class GlobalSettingsPage extends React.PureComponent {
  render () {
    const { classes, sliderList, viewSettings: {isSettingsDialogMode, lastFocusedIdx} } = this.props

    return (
      <Table
        className={classes.root}
      >
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Driver</TableCell>
            <TableCell>Listeners</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            sliderList.map((sliderEntry, idx) => {
              const driverName = this.outputIdToDriverName(sliderEntry.midi.midiDrivers, sliderEntry.outputId)
              const rowStyle = {
                background: (!driverName && !['PAGE', 'LABEL'].includes(sliderEntry.type)) ? 'red' : 'none',
                cursor: 'pointer'
              }

              if (isSettingsDialogMode && (idx === lastFocusedIdx)) {
                return (
                  <MidiSettingsDialog
                    key={`glb-${idx}`}
                    open
                    onClose={this.props.actions.toggleSettingsDialogMode.bind(this, {idx, isSettingsDialogMode: false})}
                    sliderEntry={sliderEntry}
                    idx={idx}
                  />
                )
              }

              return (
                <TableRow
                  key={`glb-${idx}`}
                  style={rowStyle}
                  onClick={this.props.actions.toggleSettingsDialogMode.bind(this, {idx, isSettingsDialogMode: true})}
                >
                  <TableCell>
                    {sliderEntry.label || '-'}
                  </TableCell>
                  <TableCell>
                    {sliderEntry.type}
                  </TableCell>
                  <TableCell>
                    {driverName || '-'}
                  </TableCell>
                  <TableCell>
                    {(sliderEntry.listenToCc && (sliderEntry.listenToCc.length > 0) && this.renderListeners(sliderEntry.listenToCc)) || '-'}
                  </TableCell>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    )
  }

  renderListeners = (listenToCc) => {
    return (<div>{listenToCc.join(', ')}</div>)
  }

  outputIdToDriverName = (drivers, outputId) => {
    let name = ''
    drivers.forEach((item) => {
      if (item.outputId === outputId) {
        name = item.name
      }
    })
    return name
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
    actions: bindActionCreators({...MidiSliderActions, ...ViewStuff}, dispatch)
  }
}
function mapStateToProps ({ sliderList, viewSettings }) {
  return {
    sliderList,
    viewSettings
  }
}
export default (withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(GlobalSettingsPage)))
