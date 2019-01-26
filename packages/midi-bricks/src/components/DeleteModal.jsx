import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as MidiSliderActions } from '../actions/slider-list.js'
import { Actions as ViewActions } from '../actions/view-settings.js'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import Tooltip from '@material-ui/core/Tooltip'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DeleteIcon from '@material-ui/icons/Delete'

class DeleteModal extends React.PureComponent {
  state = {
    open: false
  }

  render() {
    const {
      classes,
      sliderEntry,
      asButton,
      isOpen,
      onAction,
      actions,
      onClose,
    } = this.props

    return (
      <React.Fragment>
        {asButton && (
          <Tooltip title="Remove">
            <Button
              className={classes.button}
              variant="contained"
              onClick={this.handleClickOpen}
            >
              <DeleteIcon className={classes.iconColor} />
            </Button>
          </Tooltip>
        )}

        <Dialog
          open={this.state.open || isOpen}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText color="secondary" id="alert-dialog-description">
              Do you really want to delete?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseCancel} color="secondary">
              No
            </Button>
            <Button
              onClick={this.handleClose.bind(
                this,
                sliderEntry,
                onAction,
                actions,
                onClose
              )}
              color="secondary"
              autoFocus
            >
              Yes, Delete!
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleCloseCancel = e => {
    this.setState({ open: false })
    e.preventDefault()
  }

  handleClose = ({ i }, onAction, actions, onClose) => {
    this.setState({ open: false })
    onAction && onAction()
    actions.delete({ i })
    actions.deletePageFromFooter({ i })
    onClose()
  }
}

const styles = theme => ({
  button: {
    margin: 8,
    width: '95%',
    background: theme.palette.button.background,
  },
  iconColor: {
    color: theme.palette.primary.contrastText,
    cursor: 'pointer',
  },
})

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...MidiSliderActions, ...ViewActions },
      dispatch
    ),
  }
}

export default withStyles(styles)(
  connect(
    null,
    mapDispatchToProps
  )(DeleteModal)
)
