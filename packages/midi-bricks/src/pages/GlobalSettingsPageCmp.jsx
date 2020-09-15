import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Tooltip,
  Paper
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { connect, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as MidiSliderActions } from '../global-state/actions/slider-list.js'
import { Actions as ViewStuff } from '../global-state/actions/view-settings.js'
import { thunkLiveModeToggle } from '../global-state/actions/thunks/thunk-live-mode-toggle'
import { outputToDriverName } from '../utils/output-to-driver-name.js'
import { STRIP_TYPE } from '../global-state/reducers/slider-list.js'
import DriverExpansionPanel from '../components/DriverExpansionPanel.jsx'
import { thunkChangePage } from '../global-state/actions/thunks/thunk-change-page'

export const GlobalSettingsPage = connect(
  null,
  mapDispatchToProps
)(GlobalSettingsPageComponent)

GlobalSettingsPageComponent.propTypes = {
  actions: PropTypes.object,
  isMidiFailed: PropTypes.bool,
  midi: PropTypes.object,
  pages: PropTypes.object,
  sliderList: PropTypes.array,
  thunkChangePage: PropTypes.func,
  thunkLiveModeToggle: PropTypes.func,
  viewSettings: PropTypes.object
}

function GlobalSettingsPageComponent(props) {
  const { sliderList, midi, isMidiFailed } = useSelector(
    (state) => state.sliders || {}
  )
  const pages = useSelector((state) => state.pages)
  const viewSettings = useSelector((state) => state.viewSettings)
  const {
    isSettingsDialogMode,
    lastFocusedPage,
    lastFocusedIdx,
    availableDrivers: { outputs: chosenOutputs, inputs: chosenInputs },
    pageTargets
  } = viewSettings
  const theme = useTheme()
  const classes = makeStyles(styles.bind(this, theme))()
  const { actions, thunkChangePage } = props

  if (isMidiFailed) return <div />
  const hasPage = Object.values(pages).length > 0
  const pagesArray = hasPage ? Object.values(pages) : []
  const { midiAccess } = midi || {}
  const { inputs = [], outputs = [] } = midiAccess || {}
  return (hasPage ? pagesArray : ['OK']).map((page, idx) => {
    const label = (pageTargets[idx] && pageTargets[idx].label) || page.label
    const isExpanded = lastFocusedPage === page.id
    return (
      <DriverExpansionPanel
        label={label || 'O'}
        isEmpty={false}
        expanded={isExpanded}
        key={`exp-${idx}`}
        onChange={
          isExpanded
            ? () => thunkChangePage(lastFocusedPage, '')
            : () => thunkChangePage(lastFocusedPage, page.id)
        }
      >
        <Paper style={{ flexDirection: 'column' }} className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Label</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Output Driver</TableCell>
                <TableCell>Output Channel</TableCell>
                <TableCell>Note(s)/CC</TableCell>
                <TableCell>Current Value</TableCell>
                <TableCell>Saved Value</TableCell>
                <TableCell>Input Driver</TableCell>
                <TableCell>Listeners</TableCell>
                <TableCell>Input Channel</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(sliderList) &&
                sliderList.map((sliderEntry) => {
                  const {
                    label,
                    type,
                    midiChannel,
                    midiCC,
                    val,
                    lastSavedVal,
                    midiChannelInput,
                    listenToCc,
                    i
                  } = sliderEntry

                  let rowStyle = {
                    background: 'none',
                    cursor: 'pointer'
                  }

                  if (isSettingsDialogMode && i === lastFocusedIdx) {
                    const MidiSettingsDialog = React.lazy(() =>
                      import(
                        '../components/midi-settings-dialog/MidiSettingsDialog.jsx'
                      )
                    )
                    return (
                      <Suspense fallback={<div>Loading...</div>}>
                        <MidiSettingsDialog
                          key={`glb-settings-${i}`}
                          open
                          onClose={actions.toggleSettingsDialogMode.bind(this, {
                            i,
                            isSettingsDialogMode: false,
                            lastFocusedPage
                          })}
                          sliderEntry={sliderEntry}
                        />
                      </Suspense>
                    )
                  }
                  let title = ''
                  let channelTooltipTitle = ''

                  const { driverName, driverNameInput } = outputToDriverName(
                    { inputs, outputs },
                    sliderEntry.driverNameInput || 'None',
                    sliderEntry.driverName || 'None'
                  )

                  const {
                    title: tooltipTitle,
                    background
                  } = createTooltipAndBackground(
                    sliderEntry.type,
                    driverNameInput,
                    driverName
                  )

                  if (background) {
                    rowStyle.background = background
                  }

                  if (tooltipTitle) {
                    title = tooltipTitle
                  }

                  const isBadChosenOutputDriver = isBadChosenDriver(
                    chosenOutputs,
                    driverName
                  )

                  const isBadChosenInputDriver = isBadChosenDriver(
                    chosenInputs,
                    driverNameInput
                  )

                  const isBadChosenOutputChannel =
                    !isBadChosenOutputDriver &&
                    isBadChosenChannel(
                      chosenOutputs,
                      midiChannel,
                      driverName,
                      type,
                      true
                    )

                  const isBadChosenInputChannel =
                    !isBadChosenInputDriver &&
                    isBadChosenChannel(
                      chosenInputs,
                      midiChannelInput,
                      driverNameInput,
                      type,
                      false
                    )

                  if (isBadChosenOutputDriver) {
                    title += `Output Driver "${driverName}" is disabled in MIDI Driver Settings. `
                  } else if (isBadChosenOutputChannel && driverName) {
                    if (midiChannel) {
                      channelTooltipTitle = `Output Channel "${midiChannel}" for driver "${driverName}" is disabled in MIDI Driver Settings. `
                    } else {
                      channelTooltipTitle = `No Output Channel for driver "${driverName}" was chosen. `
                    }
                  }

                  if (isBadChosenInputDriver) {
                    title += `Input Driver "${driverNameInput}" is disabled in MIDI Driver Settings. `
                  } else if (isBadChosenInputChannel && driverNameInput) {
                    if (midiChannelInput) {
                      channelTooltipTitle += `Input Channel "${midiChannelInput}" for driver "${driverNameInput}" is disabled in MIDI Driver Settings`
                    } else {
                      channelTooltipTitle += `No Input Channel for driver "${driverNameInput}" was chosen`
                    }
                  }

                  return (
                    <Tooltip
                      title={title + channelTooltipTitle}
                      key={`glb-${i}`}
                    >
                      <TableRow
                        style={rowStyle}
                        onClick={() => {
                          actions.setLastFocusedIndex({ i })
                          actions.toggleSettingsDialogMode({
                            i,
                            isSettingsDialogMode: true,
                            lastFocusedPage
                          })
                        }}
                      >
                        <TableCell>{label || '-'}</TableCell>
                        <TableCell>{type}</TableCell>
                        <TableCell
                          style={{
                            color: !driverName && 'grey',
                            background: isBadChosenOutputDriver && 'pink'
                          }}
                        >
                          {driverName || sliderEntry.driverName || 'None'}
                        </TableCell>
                        <TableCell
                          style={{
                            background: isBadChosenOutputChannel && 'pink'
                          }}
                        >
                          {midiChannel}
                        </TableCell>
                        <TableCell>
                          {(midiCC &&
                            midiCC.length > 0 &&
                            renderListeners(midiCC)) ||
                            '-'}
                        </TableCell>
                        <TableCell>
                          {![STRIP_TYPE.PAGE, STRIP_TYPE.LABEL].includes(type)
                            ? sliderEntry && val
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {![STRIP_TYPE.PAGE, STRIP_TYPE.LABEL].includes(type)
                            ? lastSavedVal && (lastSavedVal || '_')
                            : '-'}
                        </TableCell>
                        <TableCell
                          style={{
                            color: !driverNameInput && 'grey',
                            background: isBadChosenInputDriver && 'pink'
                          }}
                        >
                          {driverNameInput ||
                            sliderEntry.driverNameInput ||
                            'None'}
                        </TableCell>
                        <TableCell>
                          {(listenToCc &&
                            listenToCc.length > 0 &&
                            renderListeners(listenToCc)) ||
                            '-'}
                        </TableCell>
                        <TableCell
                          style={{
                            background: isBadChosenInputChannel && 'pink'
                          }}
                        >
                          {midiChannelInput}
                        </TableCell>
                      </TableRow>
                    </Tooltip>
                  )
                })}
            </TableBody>
          </Table>
        </Paper>
      </DriverExpansionPanel>
    )
  })
}

function renderListeners(tmp) {
  return <div>{tmp.join(', ')}</div>
}

// function hasChanged(sliderListBackup, sliderEntry) {
//   let retVal = false
//   sliderListBackup &&
//     sliderListBackup.forEach((sliderBackupEntry, idx) => {
//       if (sliderBackupEntry.i === sliderEntry.i) {
//         const backupVals = Object.values(sliderBackupEntry)
//         const vals = Object.values(sliderEntry)
//         retVal = backupVals.join(', ') !== vals.join(', ')
//       }
//     })
//   return retVal
// }

function styles(theme) {
  return {
    root: {},
    table: {
      textAlign: 'left'
    },
    heading: {
      marginTop: theme.spacing(2)
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...MidiSliderActions, ...ViewStuff },
      dispatch
    ),
    thunkChangePage: bindActionCreators(thunkChangePage, dispatch),
    thunkLiveModeToggle: bindActionCreators(thunkLiveModeToggle, dispatch)
  }
}

function isBadChosenDriver(driverObject, driverName) {
  if (driverName === 'None') return false
  let foundMischosenDriver = false
  Object.keys(driverObject).forEach((name) => {
    if (foundMischosenDriver || name === 'None') return false
    if (name === driverName) {
      if (
        (!foundMischosenDriver &&
          driverObject[name] &&
          driverObject[name].ccChannels &&
          driverObject[name].ccChannels.length <= 0) ||
        (driverObject[name] &&
          driverObject[name].noteChannels &&
          driverObject[name].noteChannels.length <= 0)
      ) {
        foundMischosenDriver = true
      }
    }
  })
  return foundMischosenDriver
}

function isBadChosenChannel(driverObject, channel, driverName, type, isOut) {
  if (driverName === 'None') return false
  if (!channel) return true

  let foundMischosenChannel = false
  const { noteChannels = [], ccChannels = [] } = driverObject[driverName] || {}
  const isNoteChannels = noteChannels.includes(`${channel}`)
  const isCcChannels = ccChannels.includes(`${channel}`)

  // For page and label, only cc inputs can happen
  if ([STRIP_TYPE.PAGE, STRIP_TYPE.LABEL].includes(type) && !isOut) {
    foundMischosenChannel = !isCcChannels
  }

  // slider // cc button
  if (
    [
      STRIP_TYPE.SLIDER,
      STRIP_TYPE.SLIDER_HORZ,
      STRIP_TYPE.BUTTON_CC,
      STRIP_TYPE.BUTTON_TOGGLE_CC
    ].includes(type)
  ) {
    foundMischosenChannel = !isCcChannels
  }

  // button
  if ([STRIP_TYPE.BUTTON, STRIP_TYPE.BUTTON_TOGGLE].includes(type)) {
    foundMischosenChannel = !isNoteChannels
  }

  return foundMischosenChannel
}

function createTooltipAndBackground(type, driverNameInput, driverName) {
  let title = undefined
  let background = undefined
  if (![STRIP_TYPE.PAGE, STRIP_TYPE.LABEL].includes(type)) {
    if (driverNameInput && driverName) {
      //title = `Output: ${driverName} / Input: ${driverNameInput}`
    } else if (driverName) {
      //title = `Output: ${driverName}`
      if (!driverNameInput) {
        title = ' Input: No MIDI Input Driver available. '
        background = 'yellow'
      }
    } else if (!driverName) {
      title = 'No MIDI Output Driver available. '
      background = 'red'
    }
  }
  return { title, background }
}
