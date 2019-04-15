import React, { useState } from 'react'
import PropTypes from 'prop-types'
import keycode from 'keycode'
import Downshift from 'downshift'
import { makeStyles } from '@material-ui/styles'
import TextField from '@material-ui/core/TextField'

import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import Chip from '@material-ui/core/Chip'

const useStyles = makeStyles(styles, { useTheme: true })

MidiSuggestedInput.propTypes = {
  actions: PropTypes.object,
  idx: PropTypes.number,
  startVal: PropTypes.array,
  suggestions: PropTypes.array
}

function MidiSuggestedInput(props) {
  // state = {
  //   inputValue: '',
  //   selectedItem: this.props.startVal || [],
  // }
  const { actions, idx, suggestions, startVal = [] } = props

  const [inputValue, setInputValue] = useState('')
  const [selectedItem, setSelectedItem] = useState(startVal)
  const classes = useStyles()

  return (
    <Downshift
      inputValue={inputValue}
      onChange={handleChange.bind(
        this,
        idx,
        selectedItem,
        actions,
        setInputValue,
        setSelectedItem
      )}
      selectedItem={selectedItem}
    >
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
              startAdornment: selectedItem.map((item) => (
                <Chip
                  key={item}
                  tabIndex={-1}
                  label={item}
                  className={classes.chip}
                  onDelete={handleDelete.bind(
                    this,
                    idx,
                    selectedItem,
                    handleChange,
                    setInputValue,
                    setSelectedItem,
                    item
                  )}
                />
              )),
              onChange: handleInputChange.bind(this, setInputValue),
              onKeyDown: handleKeyDown.bind(
                this,
                inputValue,
                selectedItem,
                setSelectedItem
              ),
              id: 'integration-downshift-multiple'
            })
          })}
          {isOpen ? (
            <Paper className={classes.paper} square>
              {getSuggestions(suggestions, inputValue).map(
                (suggestion, index) =>
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

function renderInput(inputProps) {
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

function handleKeyDown(inputValue, selectedItem, setSelectedItem, event) {
  if (
    selectedItem.length &&
    !inputValue.length &&
    keycode(event) === 'backspace'
  ) {
    const freshItem = [...selectedItem]
    setSelectedItem(freshItem.slice(0, selectedItem.length - 1))
  }
}

function handleInputChange(setInputValue, event) {
  setInputValue(event.target.value)
}

function handleChange(
  idx,
  selectedItem,
  action,
  setInputValue,
  setSelectedItem,
  item
) {
  let freshItem = [...selectedItem]
  if (!freshItem.includes(item)) {
    freshItem = [...freshItem, item]
    action && action.handleChange && action.handleChange({ idx, val: selectedItem })
  }
  setInputValue('')
  setSelectedItem(freshItem)
}

function handleDelete(
  idx,
  selectedItem,
  handleChange,
  setInputValue,
  setSelectedItem,
  item
) {
  return function() {
    let freshSelectedItem = [...selectedItem]
    freshSelectedItem.splice(freshSelectedItem.indexOf(item), 1)
    handleChange && handleChange({ idx, val: selectedItem })
    return { selectedItem }
  }
}

function getSuggestions(suggestions, inputValue) {
  return suggestions.filter((suggestion) => {
    const keep =
      suggestion.label.toLowerCase().includes(inputValue.toLowerCase())

    return keep
  })
}

function styles(theme) {
  return {
    root: {
      flexGrow: 1
    },
    container: {
      flexGrow: 1,
      position: 'relative',
      marginTop: theme.spacing(5)
    },
    paper: {
      position: 'absolute',
      zIndex: 1,
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      left: 0,
      right: 0,
      maxHeight: 220,
      overflowY: 'scroll'
    },
    chip: {
      margin: `${theme.spacing(1) / 2}px ${theme.spacing(1) / 4}px`
    },
    inputRoot: {
      flexWrap: 'wrap',
      width: 200,

      margin: theme.spacing(1)
    }
  }
}

function renderSuggestion({
  suggestion,
  index,
  itemProps,
  highlightedIndex,
  selectedItem
}) {
  const isHighlighted = highlightedIndex === index
  const isSelected = selectedItem || ''.includes(suggestion.label)

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

export default MidiSuggestedInput
