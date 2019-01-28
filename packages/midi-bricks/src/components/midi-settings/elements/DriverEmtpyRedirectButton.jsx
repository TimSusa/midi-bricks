import React from 'react'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import { PAGE_TYPES } from '../../../reducers/view-settings'

export function DriverEmtpyRedirectButton({
  i,
  actions: { toggleSettingsDialogMode, togglePage },
}) {
  return (
    <Tooltip title="No MIDI Driver available. Go to settings...">
      <Button
        onClick={() => {
          toggleSettingsDialogMode({
            idx: i,
            isSettingsDialogMode: false,
          })
          togglePage({
            pageType: PAGE_TYPES.MIDI_DRIVER_MODE,
          })
        }}
      >
        Go to Driver Settings
      </Button>
    </Tooltip>
  )
}
