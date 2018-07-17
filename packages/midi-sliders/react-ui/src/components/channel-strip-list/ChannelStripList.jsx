import React from 'react'
import Typography from '@material-ui/core/Typography'
import ChannelStrip from './channel-strip/ChannelStrip'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

class ChannelStripList extends React.Component {
  render () {
    if (this.props.sliderList.length > 0) {
      return (
        <div>
          <div id='channelList' className={this.props.classes.channelList}>
            {this.renderChannelStrips()}
          </div>
        </div>
      )
    } else {
      return (
        <Typography variant='display1' className={this.props.classes.noMidiTypography}>
          <br />
          <br />
            Please add a slider!
          <br />
          <br />
            You can do this with the button at the right top in the AppBar → ↑
        </Typography>
      )
    }
  }

  renderChannelStrips = () => {
    const entries = this.props.sliderList
    return entries && entries.map((sliderEntry, idx) => {
      const data = { sliderEntry, idx }
      return (
        <ChannelStrip
          key={`slider-${idx}`}
          {...data}
        />
      )
    })
  }
}

const styles = theme => ({
  channelList: {
    display: 'flex',
    overflowX: 'scroll'
  }
})

function mapStateToProps (state) {
  return {
    sliderList: state.sliderList
  }
}

export default (withStyles(styles)(connect(mapStateToProps, null)(ChannelStripList)))
