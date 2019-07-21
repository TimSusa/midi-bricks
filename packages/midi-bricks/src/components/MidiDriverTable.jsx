import React from 'react'
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Checkbox,
  Card,
  Typography
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/styles'


const channelDummy = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

MidiDriverTable.propTypes = {
  available: PropTypes.object,
  handleCheckboxClickCc: PropTypes.func,
  handleCheckboxClickNote: PropTypes.func,
  labelPostfix: PropTypes.string,
  name: PropTypes.string
}

function MidiDriverTable(props) {
    const theme = useTheme()
  const classes = makeStyles(styles.bind(this, theme), { withTheme: true })()
  const {
    labelPostfix,
    available,
    name,
    handleCheckboxClickNote,
    handleCheckboxClickCc
  } = props
  return (
    <Card className={classes.card}>
      <Typography
        variant='body2'
        color='secondary'
        className={classes.topLabel}
      >
        {`${name} (${labelPostfix})`}
      </Typography>
      <Table color='primary' padding='none' className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography
                variant='caption'
                color='secondary'
                className={classes.label}
              >
                {'   '}
              </Typography>
            </TableCell>

            <TableCell>
              <Typography
                variant='caption'
                color='secondary'
                className={classes.label}
              >
                {' All'}
              </Typography>
            </TableCell>
            {channelDummy.map((item, idx) => (
              <TableCell key={`input-midi-head-${idx}`}>
                <Typography
                  variant='caption'
                  color='secondary'
                  className={classes.label}
                >
                  Ch {idx + 1}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography
                variant='body2'
                color='secondary'
                className={classes.label}
              >
                Note
              </Typography>
            </TableCell>
            <TableCell>
              <Checkbox
                value={'all'}
                checked={
                  available[name] &&
                  Array.isArray(available[name].noteChannels) &&
                  available[name].noteChannels.length === 16
                }
                onClick={handleCheckboxClickNote.bind(
                  this,
                  name,
                  available[name] &&
                    Array.isArray(available[name].noteChannels) &&
                    available[name].noteChannels.length === 16
                )}
              />
            </TableCell>
            {channelDummy.map((item, idx) => (
              <TableCell key={`input-midi-note-${idx}`}>
                <Checkbox
                  value={`${idx + 1}`}
                  checked={isCheckedNote(available, name, `${idx + 1}`)}
                  onClick={handleCheckboxClickNote.bind(
                    this,
                    name,
                    isCheckedNote(available, name, `${idx + 1}`)
                  )}
                />
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                variant='body2'
                color='secondary'
                className={classes.label}
              >
                CC
              </Typography>
            </TableCell>
            <TableCell>
              <Checkbox
                value={'all'}
                checked={
                  available[name] &&
                  Array.isArray(available[name].ccChannels) &&
                  available[name].ccChannels.length === 16
                }
                onClick={handleCheckboxClickCc.bind(
                  this,
                  name,
                  available[name] &&
                    Array.isArray(available[name].ccChannels) &&
                    available[name].ccChannels.length === 16
                )}
              />
            </TableCell>
            {channelDummy.map((item, idx) => (
              <TableCell key={`input-midi-cc-${idx}`}>
                <Checkbox
                  value={`${idx + 1}`}
                  checked={isCheckedCc(available, name, `${idx + 1}`)}
                  onClick={handleCheckboxClickCc.bind(
                    this,
                    name,
                    isCheckedCc(available, name, `${idx + 1}`)
                  )}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  )
}

function isCheckedNote(availableDrivers, name, val) {
  if (!availableDrivers) return false
  const { noteChannels = [] } = availableDrivers[name] || { noteChannels: [] }
  const isCheckedNote = noteChannels.includes(val)
  return isCheckedNote
}

function isCheckedCc(availableDrivers, name, val) {
  if (!availableDrivers) return false
  const { ccChannels = [] } = availableDrivers[name] || { ccChannels: [] }
  const isCheckedCc = ccChannels.includes(val)
  return isCheckedCc
}

function styles(theme) {
  return {
    root: {
      margin: theme.spacing(2),
      padding: 0
    },
    heading: {
      margin: theme.spacing(1)
    },
    card: {
      margin: theme.spacing(2),
      background: 'whitesmoke'
    },
    table: {
      textAlign: 'left',
      background: '#fafafa'
      // width: '100%',
      // margin: '8px, 0, 8px, 0'
    },
    tableCell: {
      background: theme.palette.primary
    },
    topLabel: {
      margin: theme.spacing(1)
    },
    label: {
      marginLeft: theme.spacing(1)
    }
  }
}

export default MidiDriverTable
