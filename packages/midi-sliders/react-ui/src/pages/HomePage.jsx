import { Typography, withStyles } from '@material-ui/core'
import * as React from 'react'
import { connect } from 'react-redux'

class HomePage extends React.Component {
  render () {
    return (
      <div className={this.props.classes.root}>
        <Typography variant='display1' gutterBottom>
          You have {this.props.todoList.length} TODOs in your list!
        </Typography>
      </div>
    )
  }
}

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20
  }
})

function mapStateToProps (state) {
  return {
    todoList: state.todoList
  }
}

export default (withStyles(styles)(connect(mapStateToProps)(HomePage)))
