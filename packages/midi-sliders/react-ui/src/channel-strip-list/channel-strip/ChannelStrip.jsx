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
import VolumeSlider from './VolumeSlider'

import { withStyles } from '@material-ui/core/styles'

const ChannelStrip = (props) => {
  const { availableDrivers, sliderEntry, idx } = props.data
  const { classes } = props
  return (
    <div className={classes.sliderContainer}>
      <Input
        className={classes.input}
        type='text'
        onChange={props.handleInputLabel.bind(this, idx)}
        value={sliderEntry.label} />
      <VolumeSlider
        value={sliderEntry.val}
        onChange={val => props.handleSliderChange(val, idx)} />
      <Typography className={classes.caption}>{sliderEntry.val}</Typography>
      <Tooltip
        placement='right'
        title='Trigger sending MIDI Note'
      >
        <Button
          className={classes.button}
          variant='raised'
          onClick={props.handleNoteTrigger.bind(this, idx)}>
          <MusicIcon className={classes.iconColor} />
        </Button>
      </Tooltip>
      <Tooltip
        placement='right'
        title='Toggle sending Note On/Off'
      >
        <Button
          className={classes.button}
          variant='raised'
          onClick={props.handleNoteToggle.bind(this, idx)}>
          <MusicIcon className={classes.iconColor} />
          <Typography
            variant='caption'>
            {sliderEntry.isNoteOn ? 'Off ' : 'On'}
          </Typography>

        </Button>
      </Tooltip>
      <Tooltip
        placement='right'
        title='You can set a CC Value or Note Message here.'
      >
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor='cc'>CC / Note </InputLabel>
          <Input
            className={classes.input}
            id='number'
            type='number'
            name={`input-cc-name-${idx}`}
            value={sliderEntry.midiCC}
            onChange={props.handleCcChange} />
        </FormControl>
      </Tooltip>
      <br />
      <Tooltip
        placement='right'
        title={getSelectedDriverName(availableDrivers, sliderEntry.outputId)}>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor='cc'>Driver </InputLabel>
          <Select
            className={classes.select}
            onChange={props.handleDriverSelectionChange.bind(this, idx)}
            value={sliderEntry.outputId}>
            {renderDriverSelection(availableDrivers)}
          </Select>
        </FormControl>
      </Tooltip>

      <Tooltip
        placement='right'
        title='You can set the MIDI Channel here.'
      >
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor='cc'>Channel </InputLabel>
          <Input
            className={classes.input}
            id='number'
            type='number'
            name={`input-channel-name-${idx}`}
            value={sliderEntry.midiChannel}
            onChange={props.handleMidiChannelChange.bind(this, idx)} />
        </FormControl>
      </Tooltip>
      <br />
      <Tooltip
        placement='right'
        title='Remove MIDI Channel Strip'
      >
        <Button variant='raised' onClick={props.handleRemoveClick.bind(this, idx)}>
          <DeleteIcon className={classes.iconColor} />
        </Button>
      </Tooltip>
    </div>
  )
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
  sliderContainer: {
    width: 100
  },
  button: {
    margin: theme.spacing.unit
  },
  iconColor: {
    color: 'rgba(0, 0, 0, 0.54)'
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

export default withStyles(styles)(ChannelStrip)
