import React from 'react'
import Typography from '@material-ui/core/Typography'

export function MIDIMonitorLabel({
  midiLearnTypo,
  isSettings,
  midiInfo: { driver = 'None', cC = 'None', channel = 'None' },
}) {
  return (
    <div style={{border: '1px solid grey'}}>
      <Typography className={midiLearnTypo}>{`Driver: ${driver}`}</Typography>
      <Typography className={midiLearnTypo}>{`CC: ${cC}`}</Typography>
      <Typography className={midiLearnTypo}>{`Channel: ${channel}`}</Typography>
    </div>
  )
}
