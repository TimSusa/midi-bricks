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
  // constructor (props) {
  //   super(props)
  //   this.state = { value: props.data.value }
  // }

  // // I really dont know why this helps to massiveley improve performance?
  // // Be aware that this could produce bugs
  // shouldComponentUpdate (nextProps, nextState) {
  //   if (nextProps.data.value === nextState.value) {
  //     return false
  //   }
  //   return true
  // }

  render () {
    const { sliderEntry, idx, availableDrivers } = this.props.data
    const { classes } = this.props
    return (
      <React.Fragment>

        <Tooltip

          title='Trigger sending MIDI Note'
        >
          <Button
            className={classes.button}
            variant='raised'
            onClick={this.props.actions.triggerNote.bind(this, idx)}>
            <MusicIcon className={classes.iconColor} />
          </Button>
        </Tooltip>

        <Tooltip

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
        <Tooltip

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
        <Tooltip

          title={this.getSelectedDriverName(availableDrivers, sliderEntry.outputId)}>
          <FormControl className={classes.formControl}>
            <InputLabel className={classes.label} htmlFor='cc'>Driver </InputLabel>
            <Select
              className={classes.select}
              onChange={e => this.props.actions.selectSliderMidiDriver({
                idx,
                val: e.target.value
              })}
              value={sliderEntry.outputId}>
              {this.renderDriverSelection(availableDrivers)}
            </Select>
          </FormControl>
        </Tooltip>

        <Tooltip

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
        <Tooltip

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
  getSelectedDriverName = (drivers, outputId) => {
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
