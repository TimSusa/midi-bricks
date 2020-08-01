import React from 'react'
import Typography from '@material-ui/core/Typography'
import { PropTypes } from 'prop-types'

export function MIDIMonitorLabel({
  midiLearnTypo,
  isSettings,
  midiInfo: { driver = 'None', cC = 'None', channel = 'None' }
}) {
  return (
    <div style={{ border: '1px solid grey', borderRadus: 3 }}>
      <Typography className={midiLearnTypo}>{`Driver: ${driver}`}</Typography>
      <Typography className={midiLearnTypo}>{`CC: ${cC}`}</Typography>
      <Typography className={midiLearnTypo}>{`Channel: ${channel}`}</Typography>
    </div>
  )
}

MIDIMonitorLabel.propTypes = {
  midiLearnTypo: PropTypes.string,
  isSettings: PropTypes.bool,
  midiInfo: PropTypes.object
}
