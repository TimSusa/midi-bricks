import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
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
  const classes = makeStyles(styles.bind(this, theme))()
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
                onClick={handleCheckboxClickNote.bind(this, {
                  name,
                  isChecked:
                    available[name] &&
                    Array.isArray(available[name].noteChannels) &&
                    available[name].noteChannels.length === 16,
                  ch: 'all'
                })}
              />
            </TableCell>
            {channelDummy.map((item, idx) => (
              <TableCell key={`input-midi-note-${idx}`}>
                <Checkbox
                  value={`${idx + 1}`}
                  checked={isCheckedNote(available, name, `${idx + 1}`)}
                  onClick={handleCheckboxClickNote.bind(this, {
                    name,
                    isChecked: isCheckedNote(available, name, `${idx + 1}`),
                    ch: `${idx + 1}`
                  })}
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
                onClick={handleCheckboxClickCc.bind(this, {
                  name,
                  isChecked:
                    available[name] &&
                    Array.isArray(available[name].ccChannels) &&
                    available[name].ccChannels.length === 16,
                  ch: 'all'
                })}
              />
            </TableCell>
            {channelDummy.map((item, idx) => (
              <TableCell key={`input-midi-cc-${idx}`}>
                <Checkbox
                  value={`${idx + 1}`}
                  checked={isCheckedCc(available, name, `${idx + 1}`)}
                  onClick={handleCheckboxClickCc.bind(this, {
                    name,
                    isChecked: isCheckedCc(available, name, `${idx + 1}`),
                    ch: `${idx + 1}`
                  })}
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
  return noteChannels.includes(val)
}

function isCheckedCc(availableDrivers, name, val) {
  if (!availableDrivers) return false
  const { ccChannels = [] } = availableDrivers[name] || { ccChannels: [] }
  return ccChannels.includes(val)
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
