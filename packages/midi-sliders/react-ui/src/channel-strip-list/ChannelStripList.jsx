import React from 'react'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Tooltip from '@material-ui/core/Tooltip'
import VolumeSlider from '../VolumeSlider'
import { withStyles } from '@material-ui/core/styles'

const CC_MIDI_START_VAL = 60

class ChannelStripList extends React.Component {
  state = {
    sliderEntries: [{
      label: 'label',
      val: 50,
      midiCC: CC_MIDI_START_VAL,
      outputId: '',
      isNoteOn: false,
      midiChannel: 1
    }]
  }

  componentDidMount () {
    const tmp = window.localStorage.getItem('slider-entries')
    if (!tmp) {
      console.warn('Could not load from local storage. Settings not found.')
      return
    }
    const me = JSON.parse(tmp)
    this.setState({ sliderEntries: me })

    window.addEventListener(
      'beforeunload',
      this.saveStateToLocalStorage.bind(this)
    )
  }

  componentWillUnmount () {
    window.removeEventListener(
      'beforeunload',
      this.saveStateToLocalStorage.bind(this)
    )

    // saves if component has a chance to unmount
    this.saveStateToLocalStorage()
  }

  render () {
    return (
      <div>
        <Button
          variant='raised'
          onClick={this.addSlider}>
          <Typography
            variant='caption'>
            add slider
          </Typography>
        </Button>
        <div className={this.props.classes.channelList}>
          { this.renderChannelStrips() }
        </div>
      </div>

    )
  }

  renderChannelStrips = () => {
    const entries = this.state.sliderEntries
    const {
      classes,
      availableDrivers
    } = this.props
    return entries && entries.map((sliderEntry, idx) => {
      return (
        <div key={`slider-${idx}`} className={classes.sliderContainer}>
          <Input
            className={classes.input}
            type='text'
            onChange={this.handleInputLabel.bind(this, idx)}
            value={sliderEntry.label} />
          <VolumeSlider
            value={sliderEntry.val}
            onChange={val => this.handleSliderChange(val, idx)} />
          <Typography className={classes.caption}>{sliderEntry.val}</Typography>
          <Button
            className={classes.button}
            variant='raised'
            onClick={this.handleNoteTrigger.bind(this, idx)}>
            <Typography
              variant='caption'>
              trigger<br />note
            </Typography>
          </Button>
          <Button
            className={classes.button}
            variant='raised'
            onClick={this.handleNoteToggle.bind(this, idx)}>
            <Typography
              variant='caption'>
              toggle<br /> Note {sliderEntry.isNoteOn ? 'Off ' : 'On'}
            </Typography>

          </Button>
          <Tooltip
            placement='top'
            title='You can set a CC Value or Note Message here.'
          >
            <Input
              className={classes.input}
              id='number'
              type='number'
              name={`input-cc-name-${idx}`}
              value={sliderEntry.midiCC}
              onChange={this.handleCcChange} />
          </Tooltip>
          <br />
          <Tooltip
            placement='top'
            title={getSelectedDriverName(availableDrivers, sliderEntry.outputId)}>
            <FormControl className={classes.formControl}>
              {/* <InputLabel htmlFor="cc">CC</InputLabel> */}
              <Select
                className={classes.select}
                onChange={this.handleDriverSelectionChange.bind(this, idx)}
                value={sliderEntry.outputId}>
                {renderDriverSelection(availableDrivers)}
              </Select>
            </FormControl>
          </Tooltip>
          <Tooltip
            placement='top'
            title='You can set the MIDI Channel here.'
          >
            <Input
              className={classes.input}
              id='number'
              type='number'
              name={`input-channel-name-${idx}`}
              value={sliderEntry.midiChannel}
              onChange={this.handleMidiChannelChange.bind(this, idx)} />
          </Tooltip>
          <br />
          <Button variant='raised' onClick={this.handleRemoveClick.bind(this, idx)}>
            <Typography
              variant='caption'>
              remove
            </Typography>
          </Button>
        </div>
      )
    })
  }
  handleNoteToggle = (idx, e) => {
    let { sliderEntries } = this.state
    sliderEntries[idx].isNoteOn = !sliderEntries[idx].isNoteOn

    const {
      output,
      noteOn,
      noteOff
    } = this.getMidiOutputNoteOnOf(idx)

    if (sliderEntries[idx].isNoteOn) {
      output.send(noteOn)
    } else {
      output.send(noteOff)
    }
    this.setState({ sliderEntries })
  }

  handleNoteTrigger = (idx, e) => {
    const {
      output,
      noteOn,
      noteOff
    } = this.getMidiOutputNoteOnOf(idx)

    output.send(noteOn)
    setTimeout(
      function () {
        output.send(noteOff)
      },
      100
    )
  }

  getMidiOutputNoteOnOf = (idx) => {
    const { sliderEntries } = this.state
    const val = sliderEntries[idx].val
    const midiCC = sliderEntries[idx].midiCC
    const outputId = sliderEntries[idx].outputId
    const midiChannel = parseInt(sliderEntries[idx].midiChannel, 10)
    const valInt = parseInt(val, 10)
    const noteOn = [0x8f + midiChannel, midiCC, valInt]
    const noteOff = [0x7f + midiChannel, midiCC, valInt]
    const output = this.props.midiAccess.outputs.get(outputId)

    return {
      output,
      noteOn,
      noteOff
    }
  }

  handleInputLabel = (idx, e) => {
    let tmp = this.state.sliderEntries
    tmp[idx].label = e.target.value
    this.setState({ sliderEntries: tmp })
  }

  handleDriverSelectionChange = (idx, e) => {
    let tmp = this.state.sliderEntries
    tmp[idx].outputId = e.target.value
    this.setState({ sliderEntries: tmp })
  }

  handleRemoveClick = (idx) => {
    let sliderEntries = this.state.sliderEntries
    if (idx > -1) {
      sliderEntries.splice(idx, 1)
    }
    this.setState({
      sliderEntries
    })
  }

  handleCcChange = (e) => {
    let sliderEntries = this.state.sliderEntries
    const tmp = e.target.name.split('-')
    const idx = tmp[tmp.length - 1]
    sliderEntries[idx].midiCC = e.target.value
    this.setState({ sliderEntries })
  }

  handleMidiChannelChange = (idx, e) => {
    let { sliderEntries } = this.state
    sliderEntries[idx].midiChannel = e.target.value
    this.setState({
      sliderEntries
    })
  }

  addSlider = () => {
    const sliderEntries = this.state.sliderEntries || []
    const entry = {
      label: 'label' + (sliderEntries.length + 1),
      val: 80,
      midiCC: parseInt(sliderEntries.length > 0 ? sliderEntries[sliderEntries.length - 1].midiCC : 59, 10) + 1, // count up last entry,
      outputId: this.props.availableDrivers[0].outputId,
      midiChannel: 1
    }

    const newEntries = [...sliderEntries, entry]
    this.setState({
      sliderEntries: newEntries
    })
  }

  handleSliderChange = (val, idx) => {
    let sliderEntries = this.state.sliderEntries
    sliderEntries[idx].val = val
    const midiCC = sliderEntries[idx].midiCC
    const outputId = this.state.sliderEntries[idx].outputId
    var ccMessage = [0xaf + parseInt(sliderEntries[idx].midiChannel, 10), midiCC, parseInt(val, 10)]
    var output = this.props.midiAccess.outputs.get(outputId)
    output.send(ccMessage) // omitting the timestamp means send immediately.
    this.setState({
      sliderEntries
    })
  }

  saveStateToLocalStorage = () => {
    window.localStorage.setItem('slider-entries', JSON.stringify(this.state.sliderEntries))
  }
}

const getSelectedDriverName = (drivers, outputId) => {
  let name = ''
  drivers.forEach(t => {
    if (t.outputId === outputId) {
      name = t.name
    }
  })
  return name
}

const renderDriverSelection = (availableDrivers) => {
  return availableDrivers.map((item, idx) => {
    return (
      <MenuItem key={`driver-${idx}`} value={item.outputId}>{item.name}</MenuItem>
    )
  })
}

const styles = theme => ({
  channelList: {
    display: 'flex',
    marginLeft: theme.spacing.unit * 4
  },
  sliderContainer: {
    width: 100
  },
  button: {
    margin: theme.spacing.unit
  },
  input: {
    width: 80,
    margin: theme.spacing.unit,
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em'
  },
  formControl: {
    margin: theme.spacing.unit,
    maxWidth: 140
  },
  select: {
    width: 80,
    color: 'rgba(0, 0, 0, 0.54)',
    lineHeight: '1.375em'
  },
  caption: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em'
  }
})

export default withStyles(styles)(ChannelStripList)
