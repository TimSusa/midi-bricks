import * as React from 'react'
import ReactDOM from 'react-dom'

export default class FileInput extends React.Component {
  _reactFileReaderInput

  constructor (props) {
    super(props)

    const win = typeof window === 'object' ? window : {}
    if (!win.File || !win.FileReader || !win.FileList || !win.Blob) {
      console.warn(
        '[react-file-reader-input] Some file APIs detected as not supported.' +
        ' File reader functionality may not fully work.'
      )
    }
  }

  render () {
    const { as, children, style, ...props } = this.props

    const hiddenInputStyle = children ? {
      // If user passes in children, display children and hide input.
      position: 'absolute',
      // top: '-9999px',
      display: 'none'
    } : {}

    return (
      <div onClick={this.triggerInput} style={style}>
        <input
          {...props}
          type='file'
          ref={(c) => { this._reactFileReaderInput = c }}
          onChange={this.handleChange}
          onClick={() => { this._reactFileReaderInput.value = null }}
          style={hiddenInputStyle}
        />
        {children}
      </div>
    )
  }

  handleChange = (e) => {
    const files = Array.prototype.slice.call(e.target.files) // Convert into Array
    const readAs = (this.props.as || 'url').toLowerCase()

    // Build Promise List, each promise resolved by FileReader.onload.
    Promise.all(files.map(file => new Promise((resolve, reject) => {
      let reader = new window.FileReader()

      reader.onload = result => {
        // Resolve both the FileReader result and its original file.
        resolve([result, file])
      }

      // Read the file with format based on this.props.as.
      switch (readAs) {
        case 'binary': {
          (reader).readAsBinaryString(file)
          break
        }
        case 'buffer': {
          reader.readAsArrayBuffer(file)
          break
        }
        case 'text': {
          reader.readAsText(file)
          break
        }
        case 'url': {
          reader.readAsDataURL(file)
          break
        }
        default:
      }
    })))
      .then(zippedResults => {
      // Run the callback after all files have been read.
        this.props.onChange(e, zippedResults)
      })
  }

  triggerInput = () => {
    const input = ((ReactDOM.findDOMNode(this._reactFileReaderInput)))
    if (input) {
      input.click()
    }
  }
}
