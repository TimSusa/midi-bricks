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

class ChannelStripList extends React.PureComponent {
  hasListener = false
  componentWillMount () {
    document.body.addEventListener('keypress', this.handleKeyPress)
  }
  componentWillUnmount () {
    document.body.removeEventListener('keypress', this.handleKeyPress)
  }
  render () {
    const {
      classes,
      sliderList,
      viewSettings: { isLayoutMode, isCompactHorz, isAutoArrangeMode, isSettingsDialogMode }
    } = this.props

    // Protect dialog mode from global listeners
    if (isSettingsDialogMode) {
      document.body.removeEventListener('keypress', this.handleKeyPress)
      this.hasListener = false
    } else {
      if (!this.hasListener) {
        document.body.addEventListener('keypress', this.handleKeyPress)
        this.hasListener = true
      }
    }

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
                  right: -12,
                  top: -16,
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
                            toggleSettings={this.props.actions.toggleSettingsDialogMode}
                            lastFocusedIdx={this.props.viewSettings.lastFocusedIdx}
                            isSettingsDialogMode={this.props.viewSettings.isSettingsDialogMode}
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
    // shift + p
    if ((e.keyCode === 80) && e.shiftKey) {
      e.preventDefault()
      this.props.actions.toggleLiveMode()
    }

    // shift + l
    if ((e.keyCode === 76) && e.shiftKey) {
      e.preventDefault()
      this.props.actions.toggleLayoutMode()
    }

    // shift + s
    if ((e.keyCode === 83) && e.shiftKey) {
      if (!this.props.viewSettings.isLayoutMode) {
        e.preventDefault()
        this.props.actions.toggleSettingsMode()
        return false
      }
    }

    // shift + a
    if ((e.keyCode === 65) && e.shiftKey) {
      if (this.props.viewSettings.isLayoutMode) {
        e.preventDefault()
        this.props.actions.toggleAutoArrangeMode()
      }
    }

    // shift + d
    if ((e.keyCode === 68) && e.shiftKey) {
      e.preventDefault()
      this.props.actions.clone()
    }

    // shift + v
    if ((e.keyCode === 86) && e.shiftKey) {
      e.preventDefault()
      this.props.actions.toggleCompactMode()
    }

    // shift + d
    if ((e.keyCode === 84) && e.shiftKey) {
      e.preventDefault()
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
