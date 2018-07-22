import React from 'react'
import Typography from '@material-ui/core/Typography'
import ChannelStrip from './channel-strip/ChannelStrip'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as ViewSettingsActions from '../../actions/view-settings'
import { withStyles } from '@material-ui/core/styles'
import { SortablePane, Pane } from 'react-sortable-pane'

class ChannelStripList extends React.Component {
  render () {
    if (this.props.sliderList.length > 0) {
      if (this.props.viewSettings.isLayoutMode) {
        return (
          <SortablePane
            id='channelList-layoutMode' className={this.props.classes.channelList}
            direction='horizontal'
            onOrderChange={this.props.actions.updateListOrder}
          // defaultOrder={['0', '1', '2']}
          >
            {this.renderChannelStrips()}
          </SortablePane>

        )
      } else {
        return (
          <div>
            <div id='channelList' className={this.props.classes.channelList}>
              {this.renderChannelStrips()}
            </div>
          </div>
        )
      }
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

      if (this.props.viewSettings.isLayoutMode) {
        return (
          <Pane
            key={`slider-${idx}`}
            resizable={{x: false, y: false}}
          >
            <div style={{pointerEvents: 'none', backgroundColor: 'rgba(0,255,0,0.3)'}}>
              <ChannelStrip
                {...data}
              />
            </div>
          </Pane>
        )
      } else {
        return (
          <ChannelStrip
            key={`slider-${idx}`}
            {...data}
          />
        )
      }
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
    sliderList: state.sliderList,
    viewSettings: state.viewSettings
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(ViewSettingsActions, dispatch)
  }
}

export default (withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ChannelStripList)))
