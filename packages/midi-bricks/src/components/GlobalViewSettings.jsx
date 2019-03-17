import React from 'react'
import DriverExpansionPanel from './DriverExpansionPanel'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as MidiSliderActions } from '../actions/slider-list.js'
import { Actions as ViewStuff } from '../actions/view-settings.js'
import { initApp } from '../actions/init.js'
import { MinMaxValInput } from './midi-settings/elements/MinMaxValInput'
import { FormControlLabel, Switch, Tooltip } from '@material-ui/core'

const isWebMode = process.env.REACT_APP_IS_WEB_MODE === 'true'

class GlobalViewSettings extends React.PureComponent {
  constructor(props) {
    super(props)
    this.props.actions.toggleLiveMode({ isLiveMode: false })
    this.state = {
      isFirstPanelExpanded: true,
      isScndPanelExpanded: true,
    }
  }
  render() {
    const {
      actions,
      viewSettings: {
        columns = 18,
        rowHeight = 40,
        isAutoSize = false,
        isFullscreenOnLivemode = false,
        marginX = 8,
        marginY = 8,
        paddingX = 8,
        paddingY = 8,
      },
    } = this.props
    const { isScndPanelExpanded } = this
    return (
      <React.Fragment>
        <DriverExpansionPanel
          label="View Settings"
          expanded={this.state.isScndPanelExpanded}
          noPadding={false}
          onChange={e =>
            this.setState({
              isScndPanelExpanded: !isScndPanelExpanded,
            })
          }
        >
          {isWebMode && (
            <FormControlLabel
              control={
                <Tooltip title="Set to fullscreen, when switching to livemode">
                  <Switch
                    checked={isFullscreenOnLivemode}
                    onChange={e => {
                      e.preventDefault()
                      e.stopPropagation()
                      actions.setFullscreenOnLivemode()
                    }}
                    value={isFullscreenOnLivemode}
                    color="secondary"
                  />
                </Tooltip>
              }
              label="Live Mode Fullscreen"
            />
          )}

          <FormControlLabel
            control={
              <Tooltip title="If true, the container height swells and contracts to fit contents">
                <Switch
                  checked={isAutoSize}
                  onChange={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    actions.toggleAutosize({})
                  }}
                  value={isAutoSize}
                  color="secondary"
                />
              </Tooltip>
            }
            label="Auto Size"
          />

          <MinMaxValInput
            label="Columns"
            name="columns"
            toolTip="Number of columns in this layout."
            value={columns}
            onChange={e =>
              actions.setColumns({ columns: parseInt(e.target.value, 10) })
            }
          />
          <MinMaxValInput
            label="Row Height"
            name="rowHeight"
            toolTip="Rows have a static height."
            value={rowHeight}
            onChange={e =>
              actions.setRowHeight({
                rowHeight: parseInt(e.target.value, 10),
              })
            }
          />
          <MinMaxValInput
            label="X Margin"
            name="xMargin"
            toolTip="Set margin between items in x-direction."
            value={marginX}
            onChange={e =>
              actions.setXMargin({
                marginX: parseInt(e.target.value, 10),
              })
            }
          />
          <MinMaxValInput
            label="Y Margin"
            name="yMargin"
            toolTip="Set margin between items in y-direction."
            value={marginY}
            onChange={e =>
              actions.setYMargin({
                marginY: parseInt(e.target.value, 10),
              })
            }
          />

          <MinMaxValInput
            label="X Container Padding"
            name="xPadding"
            toolTip="Padding inside the container in y-direction."
            value={paddingX}
            onChange={e =>
              actions.setXPadding({
                paddingX: parseInt(e.target.value, 10),
              })
            }
          />
          <MinMaxValInput
            label="Y Container Padding"
            name="yPadding"
            toolTip="Padding inside the container in y-direction."
            value={paddingY}
            onChange={e =>
              actions.setYPadding({
                paddingY: parseInt(e.target.value, 10),
              })
            }
          />
        </DriverExpansionPanel>
      </React.Fragment>
    )
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    })
  }
  handleCheckboxClickNoteIn = (name, isChecked, e) => {
    this.props.actions.setAvailableDrivers({
      input: {
        name,
        noteChannel: e.target.value,
        isChecked: !isChecked,
      },
    })
  }
  handleCheckboxClickCcIn = (name, isChecked, e) => {
    this.props.actions.setAvailableDrivers({
      input: {
        name,
        ccChannel: e.target.value,
        isChecked: !isChecked,
      },
    })
  }
  handleCheckboxClickNoteOut = (name, isChecked, e) => {
    this.props.actions.setAvailableDrivers({
      output: {
        name,
        noteChannel: e.target.value,
        isChecked: !isChecked,
      },
    })
  }
  handleCheckboxClickCcOut = (name, isChecked, e) => {
    this.props.actions.setAvailableDrivers({
      output: {
        name,
        ccChannel: e.target.value,
        isChecked: !isChecked,
      },
    })
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...MidiSliderActions, ...ViewStuff },
      dispatch
    ),
    initApp: bindActionCreators(initApp, dispatch),
  }
}
function mapStateToProps({
  sliders: { sliderList, midi, sliderListBackup },
  viewSettings,
}) {
  return {
    sliderList,
    midi,
    viewSettings,
    sliderListBackup,
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GlobalViewSettings)
