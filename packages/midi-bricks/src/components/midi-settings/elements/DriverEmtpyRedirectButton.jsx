import React from 'react'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import { useDispatch } from 'react-redux'
import { Actions as ViewActions } from '../../../global-state/actions/view-settings.js'

import { PAGE_TYPES } from '../../../global-state/reducers'
import PropTypes from 'prop-types'

const { toggleSettingsDialogMode, togglePage } = {
  ...ViewActions
}

export function DriverEmtpyRedirectButton({ i }) {
  const dispatch = useDispatch()
  return (
    <Tooltip title='No MIDI Driver available. Go to settings...'>
      <Button
        onClick={() => {
          dispatch(
            toggleSettingsDialogMode({
              i,
              isSettingsDialogMode: false,
              lastFocusedPage: i
            })
          )
          dispatch(
            togglePage({
              pageType: PAGE_TYPES.MIDI_DRIVER_MODE
            })
          )
        }}
      >
        Go to Driver Settings
      </Button>
    </Tooltip>
  )
}

DriverEmtpyRedirectButton.propTypes = {
  i: PropTypes.string
}
