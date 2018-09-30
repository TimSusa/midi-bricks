import React from 'react'
import RGL, { WidthProvider } from 'react-grid-layout'
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

const GridLayout = WidthProvider(RGL)

class ChannelStripList extends React.Component {
  componentWillMount () {
    document.body.addEventListener('keypress', this.handleKeyPress)
  }
  componentWillUnmount () {
    document.body.removeEventListener('keypress', this.handleKeyPress)
  }
  render () {
    const { classes, sliderList, viewSettings: { isLayoutMode, isCompactHorz, isAutoArrangeMode } } = this.props
    if (sliderList.length > 0) {
      return (
        <GridLayout
          rowHeight={40}
          cols={18}
          preventCollision={!isAutoArrangeMode}
          isDraggable={isLayoutMode}
          isResizable={isLayoutMode}
          compactType={isCompactHorz ? 'horizontal' : 'vertical'}
          layout={this.props.sliderList}
          onLayoutChange={isLayoutMode ? this.onLayoutChange : () => { }}
        >
          {this.renderChannelStrips()}
        </GridLayout>
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

  onLayoutChange = (layout) => {
    if (this.props.viewSettings.isLayoutMode) {
      this.props.actions.changeListOrder({ listOrder: layout })
    }
  }

  handleKeyPress = (e) => {
    if ((e.key === 'l') && e.ctrlKey) {
      this.props.actions.toggleLayoutMode()
    }

    if ((e.key === 's') && e.ctrlKey) {
      if (!this.props.viewSettings.isLayoutMode) {
        this.props.actions.toggleSettingsMode()
      }
    }

    if ((e.key === 'p') && e.ctrlKey) {
      if (this.props.viewSettings.isLayoutMode) {
        this.props.actions.toggleAutoArrangeMode()
      }
    }
    if ((e.key === 'v') && e.ctrlKey) {
      this.props.actions.toggleCompactMode()
    }
    if ((e.key === 't') && e.ctrlKey) {
      this.props.actions.changeTheme()
    }
  }
}

const styles = theme => ({
  channelList: {
    display: 'flex'
    // overflowX: 'scroll'
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
