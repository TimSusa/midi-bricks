import React from 'react'
import ChannelStrip from './channel-strip/ChannelStrip'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
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
      midiChannel: 1,
      isExpanded: true
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
          className={this.props.classes.button}
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
      availableDrivers
    } = this.props
    return entries && entries.map((sliderEntry, idx) => {
      const data = {availableDrivers, sliderEntry, idx}
      return (
        <ChannelStrip
          key={`slider-${idx}`}
          data={data}
          {...this.getMethodProps()}
        />

      )
    })
  }

  getMethodProps = () => ({
    handleNoteToggle: this.handleNoteToggle,
    handleNoteTrigger: this.handleNoteTrigger,
    handleInputLabel: this.handleInputLabel,
    handleDriverSelectionChange: this.handleDriverSelectionChange,
    handleRemoveClick: this.handleRemoveClick,
    handleCcChange: this.handleCcChange,
    handleMidiChannelChange: this.handleMidiChannelChange,
    handleSliderChange: this.handleSliderChange,
    handleExpanded: this.handleExpanded
  })

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

  handleExpanded = (idx, e) => {
    let entries = this.state.sliderEntries
    entries[idx].isExpanded = !entries[idx].isExpanded
    this.setState({sliderEntries: entries})
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

    // Either use last selected driver or take the first available one
    const availDriver = this.props.availableDrivers[0].outputId
    const lastSelectedDriver = (sliderEntries.length > 0) && sliderEntries[sliderEntries.length - 1].outputId
    const newDriver = lastSelectedDriver || availDriver

    const entry = {
      label: 'label' + (sliderEntries.length + 1),
      val: 80,
      midiCC: parseInt(sliderEntries.length > 0 ? sliderEntries[sliderEntries.length - 1].midiCC : 59, 10) + 1, // count up last entry,
      outputId: newDriver,
      midiChannel: 1,
      isExpanded: true
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

const styles = theme => ({
  channelList: {
    display: 'flex',
    marginLeft: theme.spacing.unit * 4,
    background: theme.palette.primary.main
  },
  button: {
    margin: theme.spacing.unit,
    background: theme.palette.secondary.light,
    color: theme.palette.secondary.contrastText
  }
})

export default withStyles(styles)(ChannelStripList)
