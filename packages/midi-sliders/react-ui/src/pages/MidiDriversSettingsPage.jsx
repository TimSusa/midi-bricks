import {
  withStyles,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Checkbox,
  Card,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../actions/slider-list.js'
import * as ViewStuff from '../actions/view-settings.js'
import { initApp } from '../actions/init.js'

class MidiDriversSettingsPage extends React.PureComponent {
  constructor (props) {
    super(props)
    this.props.actions.toggleLiveMode({ isLiveMode: false })

    // track driver changes after browser reload
    // this.props.initApp()
    this.state = {
      isFirstPanelExpanded: true,
      isScndPanelExpanded: true
    }
  }
  render () {
    const {
      classes,
      midi: {
        midiAccess: {
          inputs,
          outputs
        } },
      viewSettings: {
        availableDrivers: {
          inputs: availableInputs,
          outputs: avalableOutputs
        }
      }
    } = this.props
    const { isFirstPanelExpanded, isScndPanelExpanded } = this.state
    return (
      <React.Fragment>
        <DriverExpansionPanel
          label='Input MIDI Driver'
          classes={classes}
          expanded={this.state.isFirstPanelExpanded}
          onChange={e => this.setState({
            isFirstPanelExpanded: !isFirstPanelExpanded
          })}
        >
          {
            inputs.map((input, idx) => {
              const { ccChannels, noteChannels } = availableInputs[input.name] || { ccChannels: [], noteChannels: [] }
              const isNotEmpty = (ccChannels && ccChannels.length > 0) || (noteChannels && noteChannels.length > 0)
              return (
                <DriverExpansionPanel
                  key={`input-midi-${idx}`}
                  label={input.name}
                  classes={classes}
                  isEmpty={!isNotEmpty}
                >
                  <MidiDriverTable
                    labelPostfix='In'
                    classes={classes}
                    idx={idx}
                    available={availableInputs}
                    name={input.name}
                    handleCheckboxClickNote={this.handleCheckboxClickNoteIn}
                    handleCheckboxClickCc={this.handleCheckboxClickCcIn}
                  />
                </DriverExpansionPanel>
              )
            })
          }
        </DriverExpansionPanel>
        <DriverExpansionPanel
          label='Output MIDI Driver'
          classes={classes}
          expanded={this.state.isScndPanelExpanded}
          onChange={e => this.setState({
            isScndPanelExpanded: !isScndPanelExpanded
          })}
        >
          {
            outputs.map((output, idx) => {
              const { ccChannels, noteChannels } = avalableOutputs[output.name] || { ccChannels: [], noteChannels: [] }
              const isNotEmpty = (ccChannels && ccChannels.length > 0) || (noteChannels && noteChannels.length > 0)
              return (
                <DriverExpansionPanel
                  key={`output-midi-${idx}`}
                  label={output.name}
                  classes={classes}
                  isEmpty={!isNotEmpty}
                >
                  <MidiDriverTable
                    labelPostfix='Out'
                    classes={classes}
                    idx={idx}
                    available={avalableOutputs}
                    name={output.name}
                    handleCheckboxClickNote={this.handleCheckboxClickNoteOut}
                    handleCheckboxClickCc={this.handleCheckboxClickCcOut}
                  />
                </DriverExpansionPanel>
              )
            })
          }
        </DriverExpansionPanel>
      </React.Fragment>
    )
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    })
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
    margin: theme.spacing.unit * 2,
    padding: 0
  },
  heading: {
    margin: theme.spacing.unit
  },
  card: {
    margin: theme.spacing.unit * 2,
    background: 'whitesmoke'

  },
  table: {
    textAlign: 'left',
    background: '#fafafa'
    // width: '100%',
    // margin: '8px, 0, 8px, 0'
  },
  tableCell: {
    background: theme.palette.primary

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
        variant='body2'
        color='secondary'
        className={classes.topLabel}
      >
        {`${name} (${labelPostfix})`}
      </Typography>
      <Table
        color='primary'
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

const DriverExpansionPanel = ({ children, isEmpty = false, classes, expanded, onChange, label }) => {
  return (
    <ExpansionPanel
      className={classes.root}
      expanded={expanded}
      onChange={onChange}
    >
      <ExpansionPanelSummary
        style={{ margin: 0 }}
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography
          className={classes.heading}
          color='secondary'
          style={{ color: isEmpty && 'lightgrey' }}
          variant='body1'
        >
          {label}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails
        style={{ flexDirection: 'column', padding: 0, margin: 0 }}
      >
        {
          children
        }
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}
