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
  Paper,
  Typography
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
      midi: {
        midiAccess: {
          inputs,
          outputs
        } },
      viewSettings: {
        pageType,
        availableDrivers: {
          inputs: availableInputs,
          outputs: avalableOutputs
        }
      }
    } = this.props
    console.log({
      availableInputs,
      avalableOutputs
    })
    return (
      <React.Fragment>
        {
          inputs.map((input, idx) => (
            <MidiDriverTable
              labelPostfix='In'
              key={`input-midi-${idx}`}
              classes={classes}
              idx={idx}
              available={availableInputs}
              name={input.name}
              handleCheckboxClickNote={this.handleCheckboxClickNoteIn}
              handleCheckboxClickCc={this.handleCheckboxClickCcIn}
            />
          ))
        }
        {
          outputs.map((output, idx) => (
            <MidiDriverTable
              labelPostfix='Out'
              key={`output-midi-${idx}`}
              classes={classes}
              idx={idx}
              available={avalableOutputs}
              name={output.name}
              handleCheckboxClickNote={this.handleCheckboxClickNoteOut}
              handleCheckboxClickCc={this.handleCheckboxClickCcOut}
            />
          ))
        }
        {/* <br />
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
                  <TableCell
                  >
                    <Checkbox />
                  </TableCell>
                  {channelDummy.map((item, idx) => (
                    <TableCell key={`hh-${idx}`}>
                      <Checkbox />
                    </TableCell>))}
                </TableRow>
              </TableBody>
            </Table>
          ))
        } */}
      </React.Fragment>
    )
  }
  handleCheckboxClickNoteIn = (name, isChecked, e) => {
    this.props.actions.setAvailableDrivers({
      input: {
        name,
        noteChannel: e.target.value,
        isChecked: !isChecked
      }
    })
  }
  handleCheckboxClickCcIn = (name, isChecked, e) => {
    this.props.actions.setAvailableDrivers({
      input: {
        name,
        ccChannel: e.target.value,
        isChecked: !isChecked
      }
    })
  }
  handleCheckboxClickNoteOut = (name, isChecked, e) => {
    this.props.actions.setAvailableDrivers({
      output: {
        name,
        noteChannel: e.target.value,
        isChecked: !isChecked
      }
    })
  }
  handleCheckboxClickCcOut = (name, isChecked, e) => {
    this.props.actions.setAvailableDrivers({
      output: {
        name,
        ccChannel: e.target.value,
        isChecked: !isChecked
      }
    })
  }
}

const styles = theme => ({
  root: {
    textAlign: 'left'
  },
  heading: {
    margin: theme.spacing.unit * 2
  },
  card: {
    margin: theme.spacing.unit * 2
  },
  table: {
    textAlign: 'left'
    // width: '100%',
    // margin: '8px, 0, 8px, 0'
  },
  tableCell: {
  },
  topLabel: {
    margin: theme.spacing.unit
  },
  label: {
    marginLeft: theme.spacing.unit
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

export const MidiDriverTable = props => {
  const { classes, labelPostfix, available, name, handleCheckboxClickNote, handleCheckboxClickCc } = props
  return (
    <Card
      className={classes.card}
    >
      <Typography
        variant='body1'
        color='secondary'
        className={classes.topLabel}
      >
        {`${name} (${labelPostfix})`}
      </Typography>
      <Table
        padding='none'
        className={classes.table}
      >
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography
                variant='caption'
                color='secondary'
                className={classes.label}
              >
                {'   '}
              </Typography>
            </TableCell>

            <TableCell>
              <Typography
                variant='caption'
                color='secondary'
                className={classes.label}
              >
                {' All'}
              </Typography>
            </TableCell>
            {
              channelDummy.map((item, idx) => (
                <TableCell
                  key={`input-midi-head-${idx}`}
                >

                  <Typography
                    variant='caption'
                    color='secondary'
                    className={classes.label}
                  >
                    Ch {idx + 1}
                  </Typography>
                </TableCell>)
              )
            }
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography
                variant='body2'
                color='secondary'
                className={classes.label}
              >
                Note
              </Typography>
            </TableCell>
            <TableCell
            >
              <Checkbox
                value={'all'}
                checked={available[name] && Array.isArray(available[name].noteChannels) && available[name].noteChannels.length === 16}
                onClick={handleCheckboxClickNote.bind(this, name, available[name] && Array.isArray(available[name].noteChannels) && available[name].noteChannels.length === 16)}
              />
            </TableCell>
            {
              channelDummy.map((item, idx) => (
                <TableCell
                  key={`input-midi-note-${idx}`}
                >
                  <Checkbox
                    value={`${idx + 1}`}
                    checked={isCheckedNote(available, name, `${idx + 1}`)}
                    onClick={handleCheckboxClickNote.bind(this, name, isCheckedNote(available, name, `${idx + 1}`))}
                  />
                </TableCell>))
            }
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                variant='body2'
                color='secondary'
                className={classes.label}
              >
                CC
              </Typography>
            </TableCell>
            <TableCell
            >
              <Checkbox
                value={'all'}
                checked={available[name] && Array.isArray(available[name].ccChannels) && available[name].ccChannels.length === 16}
                onClick={handleCheckboxClickCc.bind(this, name, available[name] && Array.isArray(available[name].ccChannels) && available[name].ccChannels.length === 16)}
              />
            </TableCell>
            {
              channelDummy.map((item, idx) => (
                <TableCell
                  key={`input-midi-cc-${idx}`}
                >
                  <Checkbox
                    value={`${idx + 1}`}
                    checked={isCheckedCc(available, name, `${idx + 1}`)}
                    onClick={handleCheckboxClickCc.bind(this, name, isCheckedCc(available, name, `${idx + 1}`))}
                  />
                </TableCell>))
            }
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  )
}
const isCheckedNote = (availableDrivers, name, val) => {
  if (!availableDrivers) return false
  const { noteChannels = [] } = availableDrivers[name] || { noteChannels: [] }
  const isCheckedNote = noteChannels.includes(val)
  return isCheckedNote
}
const isCheckedCc = (availableDrivers, name, val) => {
  if (!availableDrivers) return false
  const { ccChannels = [] } = availableDrivers[name] || { ccChannels: [] }
  const isCheckedCc = ccChannels.includes(val)
  return isCheckedCc
}
const channelDummy = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
