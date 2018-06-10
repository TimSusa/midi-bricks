import { Button, Grid, Typography, withStyles } from '@material-ui/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as RackAction from '../actions/rack'
import RackTable from '../components/RackTable'
import RackDialog from '../components/RackDialog'

class RackPage extends React.Component {
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
        <RackDialog
          actions={this.props.actions}
          open={this.state.open}
          onClose={() => this.setState({ open: false })}
        />
        <Grid item xs={2}>
          <Typography variant='display1' gutterBottom>
            Rack List
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Button variant='raised' color='secondary' onClick={() => this.setState({ open: true })}>
            Add Rack
          </Button>
        </Grid>
        <Grid item xs={12}>
          <RackTable rackItemList={this.props.rackItemList} actions={this.props.actions} />
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
    rackItemList: state.rackItemList
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(RackAction, dispatch)
  }
}

export default (withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RackPage)))
