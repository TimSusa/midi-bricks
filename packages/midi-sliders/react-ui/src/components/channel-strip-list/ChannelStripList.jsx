import React from 'react'
import { WidthProvider, Responsive } from 'react-grid-layout'
import Typography from '@material-ui/core/Typography'
import ChannelStrip from './channel-strip/ChannelStrip'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../actions/slider-list.js'
import * as ViewSettingsActions from '../../actions/view-settings.js'

import MidiSettingsDialogButton from './channel-strip/midi-settings-dialog/MidiSettingsDialogButton'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import { SizeMe } from 'react-sizeme'

require('react-grid-layout/css/styles.css')
require('react-resizable/css/styles.css')

const ResponsiveReactGridLayout = WidthProvider(Responsive)

class ChannelStripList extends React.Component {
  static defaultProps = {
    className: 'layout',
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
    // rowHeight: 80
    // onLayoutChange: function () {}
  }
  // state = {
  //   sliderList: this.props.sliderList
  //   // layout: []
  // }

  // constructor (props) {
  //   super(props)
  //   this.state = {
  //     sliderList: this.props.sliderList
  //     // layout: this.props.sliderList
  //   }
  // }

  // componentWillReceiveProps ({ sliderList }) {
  //   if (sliderList !== this.props.sliderList) {
  //     this.setState({
  //       sliderList
  //       // layout: this.props.sliderList
  //     })
  //   }
  // }

  render () {
    const { classes, sliderList, viewSettings: { isLayoutMode, isCompactHorz } } = this.props
    if (sliderList.length > 0) {
      return (
        <ResponsiveReactGridLayout
          // rowHeight={80}
          // width={1200}
          isDraggable={isLayoutMode}
          isResizable={isLayoutMode}
          compactType={isCompactHorz ? 'horizontal' : 'vertical'}
          // layout={this.state.layout}
          onLayoutChange={this.onLayoutChange}
          // breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
          // cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
        // onBreakpointChange={this.onBreakpointChange}
        // onDragStart={this.handleDragStop}
        // onDragStop={this.handleDragStop}
        // {...this.props}
        >
          {this.renderChannelStrips()}
        </ResponsiveReactGridLayout>
      )
    } else {
      return (
        <Typography
          variant='display1'
          className={classes.noMidiTypography}
        >
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
      return (
        <div
          key={sliderEntry.i}
          data-grid={sliderEntry}
        >
          <SizeMe
            monitorHeight
          >
            {({ size }) => {
              if (this.props.viewSettings.isLayoutMode) {
                return (
                  <Card
                    style={{
                      height: '100%',
                      background: this.props.viewSettings.isLayoutMode ? 'azure' : 'transparent'
                    }}
                  >
                    <ChannelStrip
                      size={size}
                      sliderEntry={sliderEntry}
                      idx={idx}
                    />
                  </Card>
                )
              } else {
                const settingsStyle = {
                  position: 'absolute',
                  right: -0,
                  top: -4,
                  cursor: 'pointer'
                }
                return (
                  <div
                    style={{
                      height: '100%',
                      background: this.props.viewSettings.isSettingsMode ? 'beige' : 'transparent'
                    }}
                  >
                    <ChannelStrip
                      size={size}
                      sliderEntry={sliderEntry}
                      idx={idx}
                    />
                    {
                      this.props.viewSettings.isSettingsMode ? (
                        <span
                          className='settings'
                          style={settingsStyle}
                        >
                          <MidiSettingsDialogButton
                            sliderEntry={sliderEntry}
                            idx={idx}
                          />
                        </span>
                      ) : (
                        <div />
                      )
                    }
                  </div>
                )
              }
            }
            }
          </SizeMe>
        </div>
      )
    })
  }

  // onBreakpointChange = (breakpoint, cols) => {
  //   this.setState({
  //     breakpoint,
  //     cols
  //   })
  // }

  onLayoutChange = (layout) => {
    if (this.props.viewSettings.isLayoutMode) {
      this.props.actions.changeListOrder({ listOrder: layout })
    }
    // this.props.actions.changeListOrder({ listOrder: layout })
  }

  // handleDragStop = (layout, oldItem, newItem, placeholder, e, element) => {
  //   this.props.actions.changeListOrder({ listOrder: layout })
  //   this.setState({ layout })
  // }
}

const styles = theme => ({
  channelList: {
    display: 'flex',
    overflowX: 'scroll'
  }
})

function mapStateToProps ({ sliderList, viewSettings }) {
  return {
    sliderList,
    viewSettings
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ ...MidiSliderActions, ...ViewSettingsActions }, dispatch)
  }
}

export default (withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ChannelStripList)))
