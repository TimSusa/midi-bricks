import React from 'react'
import VisibilitySensor from 'react-visibility-sensor'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { withStyles } from '@material-ui/core/styles'
import Dimensions from 'react-dimensions'
import MidiSlider from './MidiSlider'
import MidiButton from './MidiButtons'
import { STRIP_TYPE } from '../../../reducers/slider-list'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../actions/slider-list.js'
import MidiSettingsDialog from './midi-settings-dialog/MidiSettingsDialog'

class ChannelStrip extends React.Component {
  state = {
    isDialogOpen: false
  }
  render () {
    const { sliderEntry, idx } = this.props
    const { classes } = this.props
    return (
      <VisibilitySensor partialVisibility>
        {({ isVisible }) =>
          <div
            style={{height: this.props.containerHeight}}
            className={classes.root}
          >

            <Typography className={classes.labelTop} >
              {sliderEntry.label}
            </Typography>

            {
              (sliderEntry.type === STRIP_TYPE.SLIDER) &&
              <MidiSlider
                sliderEntry={sliderEntry}
                idx={idx}
                height={this.props.containerHeight} />
            }
            {
              <MidiButton sliderEntry={sliderEntry} idx={idx} />
            }
            <Button
              className={classes.buttonExpand}
              onClick={() => this.setState({isDialogOpen: !this.state.isDialogOpen})}>
              {
                this.state.isDialogOpen ? (
                  <ExpandMoreIcon />
                ) : (
                  <ExpandLessIcon />
                )
              }
            </Button>
            {
              this.state.isDialogOpen ? (
                <MidiSettingsDialog
                  open={this.state.isDialogOpen}
                  onClose={this.onDialogClose}
                  sliderEntry={sliderEntry}
                  idx={idx}
                />
              ) : (
                <div />
              )
            }
          </div>
        }
      </VisibilitySensor>

    )
  }

  onDialogClose = (val) => {
    this.setState({
      isDialogOpen: !this.state.isDialogOpen
    })
  }

  handleLabelChange = (idx, e, val) => {
    this.props.actions.changeLabel({
      idx,
      val: e.target.value
    })
  }
  handleSliderChange = (idx, e, val) => {
    this.props.actions.handleSliderChange({ idx, val })
  }
}

const styles = theme => ({
  root: {
    margin: '0 16px 0 16px'
  },
  button: {
    margin: theme.spacing.unit,
    background: theme.palette.secondary.light
  },
  buttonExpand: {
    margin: '8px 0',
    width: '100%'
  },
  iconColor: {
    color: theme.palette.primary.contrastText,
    cursor: 'pointer'
  },
  labelReadOnly: {
    padding: '6px 0 7px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  input: {
    width: 80,
    margin: theme.spacing.unit,
    color: theme.palette.primary.contrastText, // 'rgba(0, 0, 0, 0.54)',
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em'
  },
  inputInput: {
  },
  labelTop: {
    textAlign: 'center',
    padding: theme.spacing.unit * 2,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    color: theme.palette.primary.contrastText,
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em'
  },
  label: {
    color: theme.palette.primary.contrastText,
    textAlign: 'center'
  }

})

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}
const options = {elementResize: true}
export default Dimensions(options)((withStyles(styles)(connect(null, mapDispatchToProps)(ChannelStrip))))
