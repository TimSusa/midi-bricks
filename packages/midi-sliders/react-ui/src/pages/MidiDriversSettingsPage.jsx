import {
  withStyles,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Tooltip,
  Checkbox,
  Card,
  Paper
} from '@material-ui/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../actions/slider-list.js'
import * as ViewStuff from '../actions/view-settings.js'
import { outputIdToDriverName } from '../utils/output-to-driver-name.js'
import { initApp } from '../actions/init.js'

class MidiDriversSettingsPage extends React.PureComponent {
  constructor (props) {
    super(props)
    this.props.actions.toggleLiveMode({ isLiveMode: false })

    // track driver changes after browser reload
    this.props.initApp()
  }
  render () {
    const {
      classes,
      sliderList,
      sliderListBackup,
      midi: { midiAccess: {
        inputs,
        outputs
      } },
      viewSettings: {
        pageType
      }
    } = this.props
    console.log({
      inputs,
      outputs
    })
    const channelDummy = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    return (
      <React.Fragment>
        {
          inputs.map((input, idx) => (
            <Table
              key={`input-${idx}`}
              className={classes.root}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Input {input.name}</TableCell>
                  {
                    channelDummy.map((item, idx) => (
                      <TableCell
                        key={`gred-${idx}`}
                      >
                      Ch {idx + 1}
                      </TableCell>)
                    )
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell
                  >
                    <Checkbox />
                  </TableCell>
                  {
                    channelDummy.map((item, idx) => (
                      <TableCell key={`sdf-${idx}`}>
                        <Checkbox />
                      </TableCell>))
                  }
                </TableRow>
              </TableBody>
            </Table>
          ))
        }
        <br />
        <br />
        {
          outputs.map((output, idx) => (
            <Table
              key={`output-${idx}`}
              className={classes.root}
            >
              <TableHead>
                <TableRow>
                  <TableCell key={`dd-${idx}`}>Output {output.name}</TableCell>
                  {channelDummy.map((item, idx) => (<TableCell key={`ee-${idx}`}>Ch {idx + 1}</TableCell>))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {channelDummy.map((item, idx) => (
                    <TableCell key={`hh-${idx}`}>
                      <Checkbox />
                    </TableCell>))}
                </TableRow>
              </TableBody>
            </Table>
          ))
        }
      </React.Fragment>
    )
  }
}

const styles = theme => ({
  root: {
    textAlign: 'left',
    width: '100%',
    margin: [8, 0, 8, 0]
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
export default (withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MidiDriversSettingsPage)))
