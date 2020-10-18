import React from 'react'
import Button from '@material-ui/core/Button'
import FileReader from '../../drawer-list/FileReader'
import PropTypes from 'prop-types'

export function ReadFileButton({ onFileChange }) {
  return (
    <FileReader as='url' onChange={onFileChange}>
      <Button variant='contained' style={{ width: '100%', marginTop: 8 }}>
        Load Background Image
      </Button>
    </FileReader>
  )
}

ReadFileButton.propTypes = {
  onFileChange: PropTypes.func
}
