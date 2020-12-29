import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import LoadIcon from '@material-ui/icons/InsertDriveFile'
import FileReader from './FileReader'
import { PropTypes } from 'prop-types'

ListItemLoadFileOnWeb.propTypes = {
  iconColor: PropTypes.any,
  onFileChange: PropTypes.func
}

export function ListItemLoadFileOnWeb({ onFileChange, iconColor }) {
  return (
    <FileReader
      as='binary'
      onChange={handleFileChangeWebMode.bind(this, onFileChange)}
    >
      <ListItem button>
        <ListItemIcon className={iconColor}>
          <LoadIcon />
        </ListItemIcon>
        <ListItemText primary='Load Preset' />
      </ListItem>
    </FileReader>
  )
}

function handleFileChangeWebMode(onFileChange, _, results) {
  if (!Array.isArray(results)) {
    throw new TypeError('No file selected')
  }
  const contentRaw = results[0][0].target.result
  const content = JSON.parse(contentRaw)
  const presetName = results[0][1].name

  onFileChange({ content, presetName })
}
