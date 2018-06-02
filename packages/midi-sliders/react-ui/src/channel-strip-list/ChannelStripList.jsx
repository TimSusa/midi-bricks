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

const ChannelStripList = ({ classes, entries, availableDrivers, handleInputLabel, handleSliderChange, handleNoteTrigger, handleNoteToggle, handleCcChange, handleDriverSelectionChange, handleRemoveClick, handleMidiChannelChange }) => {
  if (!entries) return
  return (
    <div className={classes.root}>
      {
        entries.map((sliderEntry, idx) => {
          return (
            <div key={`slider-${idx}`} className={classes.sliderContainer}>
              <Input
                className={classes.input}
                type='text'
                onChange={handleInputLabel.bind(this, idx)}
                value={entries[idx].label} />
              <VolumeSlider
                value={entries[idx].val}
                onChange={val => handleSliderChange(val, idx)} />
              <Typography className={classes.caption}>{entries[idx].val}</Typography>
              <Button
                className={classes.button}
                variant='raised'
                onClick={handleNoteTrigger.bind(this, idx)}>
                <Typography
                  variant='caption'>
                  trigger<br />note
                </Typography>
              </Button>
              <Button
                className={classes.button}
                variant='raised'
                onClick={handleNoteToggle.bind(this, idx)}>
                <Typography
                  variant='caption'>
                  toggle<br /> Note {entries[idx].isNoteOn ? 'Off ' : 'On'}
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
                  value={entries[idx].midiCC}
                  onChange={handleCcChange} />
              </Tooltip>
              <br />
              <Tooltip
                placement='top'
                title={getSelectedDriverName(availableDrivers, entries[idx].outputId)}>
                <FormControl className={classes.formControl}>
                  {/* <InputLabel htmlFor="cc">CC</InputLabel> */}
                  <Select
                    className={classes.select}
                    onChange={handleDriverSelectionChange.bind(this, idx)}
                    value={entries[idx].outputId}>
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
                  value={entries[idx].midiChannel}
                  onChange={handleMidiChannelChange.bind(this, idx)} />
              </Tooltip>
              <br />
              <Button variant='raised' onClick={handleRemoveClick.bind(this, idx)}>
                <Typography
                  variant='caption'>
                  remove
                </Typography>
              </Button>
            </div>
          )
        })
      }
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
  root: {
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