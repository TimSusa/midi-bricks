import React from 'react'
import ChannelStrip from './channel-strip/ChannelStrip'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

class ChannelStripList extends React.Component {
  render () {
    return (
      <div>
        <div className={this.props.classes.channelList}>
          {this.renderChannelStrips()}
        </div>
      </div>
    )
  }

  renderChannelStrips = () => {
    const entries = this.props.sliderList
    return entries && entries.map((sliderEntry, idx) => {
      const data = { availableDrivers: this.props.midiDrivers, sliderEntry, idx }
      return (
        <ChannelStrip
          key={`slider-${idx}`}
          data={data}
        />
      )
    })
  }
}

const styles = theme => ({
  channelList: {
    display: 'flex',
    // marginLeft: theme.spacing.unit * 4,
    overflowX: 'scroll'
    // background: theme.palette.primary.main
  }
})

function mapStateToProps (state) {
  return {
    sliderList: state.sliderList,
    midiDrivers: state.midi.midiDrivers
  }
}

export default (withStyles(styles)(connect(mapStateToProps, null)(ChannelStripList)))
