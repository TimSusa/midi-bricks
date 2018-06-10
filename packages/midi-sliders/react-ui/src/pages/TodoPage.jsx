import { Button, Grid, Typography, withStyles } from '@material-ui/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as TodoActions from '../actions/todo'
import TodoTable from '../components'
import TodoDialog from '../components/TodoDialog'

class TodoPage extends React.Component {
  state = {
    open: false
  };

  render () {
    return (
      <Grid
        container
        className={this.props.classes.root}
        alignItems={'flex-start'}
        justify={'flex-start'}
      >
        <TodoDialog
          actions={this.props.actions}
          open={this.state.open}
          onClose={() => this.setState({ open: false })}
        />
        <Grid item xs={2}>
          <Typography variant='display1' gutterBottom>
            Todo List
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Button variant='raised' color='secondary' onClick={() => this.setState({ open: true })}>
            Add Todo
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TodoTable todoList={this.props.todoList} actions={this.props.actions} />
        </Grid>
      </Grid>
    )
  }
}

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 10
  }
})

function mapStateToProps (state) {
  return {
    todoList: state.todoList
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(TodoActions, dispatch)
  }
}

export default (withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(TodoPage)))
