import React from 'react'
import PropTypes from 'prop-types'
import keycode from 'keycode'
import Downshift from 'downshift'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import Chip from '@material-ui/core/Chip'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../../actions/slider-list.js'

import { Note } from 'tonal'

class DownshiftMultiple extends React.Component {
  state = {
    inputValue: '',
    selectedItem: this.props.sliderEntry.midiCC || [Note.fromMidi(65)]
  };

  render () {
    const { classes, idx } = this.props
    const { inputValue, selectedItem } = this.state

    return (
      <Downshift inputValue={inputValue} onChange={this.handleChange.bind(this, idx)} selectedItem={selectedItem}>
        {({
          getInputProps,
          getItemProps,
          isOpen = true,
          inputValue,
          selectedItem,
          highlightedIndex
        }) => (
          <div className={classes.container}>
            {renderInput({
              fullWidth: false,
              classes,
              InputProps: getInputProps({
                startAdornment: selectedItem.map(item => (
                  <Chip
                    key={item}
                    tabIndex={-1}
                    label={item}
                    className={classes.chip}
                    onDelete={this.handleDelete(idx, item)}
                  />
                )),
                onChange: this.handleInputChange,
                onKeyDown: this.handleKeyDown,
                id: 'integration-downshift-multiple'
              })
            })}
            {isOpen ? (
              <Paper className={classes.paper} square>
                {getSuggestions(inputValue).map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion.label }),
                    highlightedIndex,
                    selectedItem: selectedItem
                  })
                )}
              </Paper>
            ) : null}
          </div>
        )}
      </Downshift>
    )
  }

  handleKeyDown = event => {
    const { inputValue, selectedItem } = this.state

    if (selectedItem.length && !inputValue.length && keycode(event) === 'backspace') {
      this.setState({
        selectedItem: selectedItem.slice(0, selectedItem.length - 1)
      })
    }
  };

  handleInputChange = event => {
    this.setState({ inputValue: event.target.value })
  };

  handleChange = (idx, item) => {
    let { selectedItem } = this.state

    if (selectedItem.indexOf(item) === -1) {
      selectedItem = [...selectedItem, item]
      this.props.actions.selectCC({ idx, val: selectedItem })
    }

    this.setState({
      inputValue: '',
      selectedItem
    })
  };

  handleDelete = (idx, item) => () => {
    this.setState(state => {
      const selectedItem = [...state.selectedItem]
      selectedItem.splice(selectedItem.indexOf(item), 1)
      this.props.actions.selectCC({ idx, val: selectedItem })
      return { selectedItem }
    })
  };
}

DownshiftMultiple.propTypes = {
  classes: PropTypes.object.isRequired
}

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  container: {
    flexGrow: 1,
    position: 'relative',
    marginTop: theme.spacing.unit * 5
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
    height: 250,
    overflowY: 'scroll'
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`
  },
  inputRoot: {
    flexWrap: 'wrap',
    width: 200,

    margin: theme.spacing.unit
  }
})

const suggestions = Array.apply(null, { length: 128 }).map(Number.call, Number).map((item) => {
  return { label: Note.fromMidi(item) }
})

function renderInput (inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot
        },
        ...InputProps
      }}
      {...other}
    />
  )
}

function renderSuggestion ({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
  const isHighlighted = highlightedIndex === index
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component='div'
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
    >
      {suggestion.label}
    </MenuItem>
  )
}
renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired
}

function getSuggestions (inputValue) {
  return suggestions.filter(suggestion => {
    const keep =
      (suggestion.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1)

    return keep
  })
}
function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}

export default (withStyles(styles)(connect(null, mapDispatchToProps)(DownshiftMultiple)))
