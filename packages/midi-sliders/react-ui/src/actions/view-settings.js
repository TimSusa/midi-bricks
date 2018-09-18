const createActions = require('./create-actions.js').createActions

const ActionTypeViewSettings = {
  TOGGLE_LAYOUT_MODE: 'TOGGLE_LAYOUT_MODE',
  TOGGLE_COMPACT_MODE: 'TOGGLE_COMPACT_MODE',
  TOGGLE_SETTINGS_MODE: 'TOGGLE_SETTINGS_MODE',
  TOGGLE_AUTO_ARRANGE_MODE: 'TOGGLE_AUTO_ARRANGE_MODE',
  CHANGE_THEME: 'CHANGE_THEME'
}

module.exports = {
  ...createActions(ActionTypeViewSettings),
  ActionTypeViewSettings
}
