import React from 'react'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Tooltip from '@material-ui/core/Tooltip'
import MusicIcon from '@material-ui/icons/MusicNote'
import DeleteIcon from '@material-ui/icons/Delete'

class ExpandedStrip extends React.Component {
  render () {
    const { sliderEntry, idx } = this.props
    const { classes } = this.props
    return (
      <React.Fragment>

        <Tooltip placement='right'

          title='Trigger sending MIDI Note'
        >
          <Button
            className={classes.button}
            variant='raised'
            onClick={this.props.actions.triggerNote.bind(this, idx)}>
            <MusicIcon className={classes.iconColor} />
          </Button>
        </Tooltip>

        <Tooltip placement='right'

          title='Toggle sending Note On/Off'
        >
          <Button
            classes={{ root: classes.button }}
            variant='raised'
            onClick={this.props.actions.toggleNote.bind(this, idx)}>
            <MusicIcon className={classes.iconColor} />
            <Typography
              variant='caption'>
              {sliderEntry.isNoteOn ? 'Off ' : 'On'}
            </Typography>

          </Button>
        </Tooltip>
        <Tooltip placement='right'

          title='You can set a CC Value or Note Message here.'
        >
          <FormControl className={classes.formControl}>
            <InputLabel className={classes.label} htmlFor='cc'>CC / Note </InputLabel>
            <Input
              className={classes.input}
              id='number'
              type='number'
              name={`input-cc-name-${idx}`}
              value={sliderEntry.midiCC}
              onChange={e => {
                this.props.actions.selectCC({ idx, val: e.target.value })
                e.preventDefault()
              }} />

          </FormControl>
        </Tooltip>
        <br />
        <Tooltip placement='right'

          title={this.getSelectedDriverName(sliderEntry)}>
          <FormControl className={classes.formControl}>
            <InputLabel className={classes.label} htmlFor='cc'>Driver </InputLabel>
            <Select
              className={classes.select}
              onChange={e => this.props.actions.selectSliderMidiDriver({
                idx,
                val: e.target.value
              })}
              value={sliderEntry.outputId}>
              {this.renderDriverSelection(sliderEntry.midi.midiDrivers)}
            </Select>
          </FormControl>
        </Tooltip>

        <Tooltip placement='right'

          title='You can set the MIDI Channel here.'
        >
          <FormControl className={classes.formControl}>
            <InputLabel className={classes.label} htmlFor='cc'>Channel </InputLabel>
            <Input
              className={classes.input}
              id='number'
              type='number'
              name={`input-channel-name-${idx}`}
              value={sliderEntry.midiChannel}
              onChange={e => this.props.actions.selectMidiChannel({ idx, val: e.target.value })} />
          </FormControl>
        </Tooltip>
        <br />
        <Tooltip placement='right'

          title='Remove MIDI Channel Strip'
        >
          <Button
            className={classes.button}
            variant='raised'
            onClick={this.props.actions.deleteSlider.bind(this, idx)}>
            <DeleteIcon className={classes.iconColor} />
          </Button>
        </Tooltip>
      </React.Fragment>
    )
  }
  getSelectedDriverName = (sliderEntry) => {
    const { outputId, midi } = sliderEntry
    const drivers = midi.midiDrivers
    let name = ''
    drivers.forEach(t => {
      if (t.outputId === outputId) {
        name = t.name
      }
    })
    return name
  }

  renderDriverSelection = (availableDrivers) => {
    return availableDrivers.map((item, idx) => {
      return (
        <MenuItem key={`driver-${idx}`} value={item.outputId}>{item.name}</MenuItem>
      )
    })
  }
}

export default ExpandedStrip
