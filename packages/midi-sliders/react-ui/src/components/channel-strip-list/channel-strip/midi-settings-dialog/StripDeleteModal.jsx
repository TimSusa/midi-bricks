import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../../actions/slider-list.js'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import DeleteIcon from '@material-ui/icons/Delete'

class StripDeleteModal extends React.Component {
  state = {
    open: false
  }

  render () {
    const {idx, classes, sliderEntry} = this.props
    return (
      <div>
        <Button
          className={classes.button}
          variant='raised'
          onClick={this.handleClickOpen}
        >
          <DeleteIcon className={classes.iconColor} />
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle
            id='alert-dialog-title'>
            {'Delete ' + sliderEntry.label + '?'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              Do you really want to delete the Channel Strip?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleCloseCancel}
              color='primary'>
              No
            </Button>
            <Button
              onClick={this.handleClose.bind(this, sliderEntry)}
              color='primary' autoFocus>
              Yes, Delete!
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleCloseCancel = (e) => {
    this.setState({ open: false })
    e.preventDefault()
  }

  handleClose = (sliderEntry, e) => {
    this.setState({ open: false })
    this.props.actions.delete({idx: sliderEntry.i})

    this.props.onClose()
    e.preventDefault()
  }
}

const styles = theme => ({
  button: {
    margin: '8px 0 8px 0',
    width: '100%',
    background: theme.palette.secondary.light
  },
  iconColor: {
    color: theme.palette.primary.contrastText,
    cursor: 'pointer'
  },
  input: {
    // margin: theme.spacing.unit,
    color: theme.palette.primary.contrastText, // 'rgba(0, 0, 0, 0.54)',
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em'
  },
  inputInput: {
    margin: theme.spacing.unit
  },
  formControl: {
    margin: theme.spacing.unit
  },
  label: {
    color: theme.palette.primary.contrastText
  },
  select: {
    color: theme.palette.primary.contrastText,
    lineHeight: '1.375em'
  }
})

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}

export default (withStyles(styles)(connect(null, mapDispatchToProps)(StripDeleteModal)))
