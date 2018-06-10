import { Button, Dialog, DialogActions, DialogTitle, TextField, withStyles } from '@material-ui/core'
import * as React from 'react'

class TodoDialog extends React.Component {
    state = {
      newTodoText: ''
    };

    static getDerivedStateFromProps (nextProps, prevState) {
      // return new state
      return { open: nextProps.open, newTodoText: '' }
    }

    handleClose = () => {
      this.props.actions.addTodo({ id: Math.random(), completed: false, text: this.state.newTodoText })
      this.props.onClose()
    };

    handleChange = (name) => (event) => {
      this.setState({
        newTodoText: event.target.value
      })
    };

    render () {
      return (
        <Dialog open={this.props.open} onClose={this.handleClose}>
          <DialogTitle>Add a new TODO</DialogTitle>
          <TextField
            id='multiline-flexible'
            multiline
            value={this.state.newTodoText}
            onChange={this.handleChange('newTodoText')}
            className={this.props.classes.textField}
          />
          <DialogActions>
            <Button color='primary' onClick={this.handleClose}>
                        OK
            </Button>
          </DialogActions>
        </Dialog>
      )
    }
}

const styles = theme => ({
  textField: {
    width: 400,
    margin: 20
  }
})

export default withStyles(styles)(TodoDialog)
